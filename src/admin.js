/* Admin Panel — manage rounds, approve submissions, create content */

import { supabase, isDemoMode } from './supabase.js';
import { getCountry } from './countries/index.js';
import { playSound } from './sounds.js';

const $ = sel => document.querySelector(sel);

let currentTab = 'pending';
let createMode = 'places';

// Cached admin status (verified from Supabase `admins` table)
let _isAdminVerified = false;

/**
 * Check admin status against the `admins` table in Supabase.
 * Call once after auth init; result is cached for the session.
 */
export async function verifyAdmin() {
  if (isDemoMode || !supabase) {
    _isAdminVerified = false;
    return false;
  }
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { _isAdminVerified = false; return false; }

    const { data, error } = await supabase
      .from('admins')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle();

    _isAdminVerified = !!data && !error;
  } catch (e) {
    console.error('Admin check error:', e);
    _isAdminVerified = false;
  }
  return _isAdminVerified;
}

/**
 * Synchronous check — returns the cached result from verifyAdmin().
 * Safe to call in UI code after verifyAdmin() has resolved.
 */
export function isAdmin() {
  return _isAdminVerified;
}

// ---- Init Admin ----
export function initAdmin() {
  bindAdminEvents();
  loadDashboard();
  loadPending();
  loadActive();
  loadPromos();
}

// ---- Dashboard Stats ----
async function loadDashboard() {
  if (isDemoMode || !supabase) return;

  try {
    // Parallel queries
    const [roundsRes, pendingRes, usersRes, transRes, premiumRes] = await Promise.all([
      supabase.from('rounds').select('id', { count: 'exact', head: true }).eq('active', true),
      supabase.from('pending_rounds').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('transactions').select('*').eq('status', 'completed').order('created_at', { ascending: false }),
      supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('is_premium', true),
    ]);

    const totalRounds = roundsRes.count || 0;
    const pendingCount = pendingRes.count || 0;
    const usersCount = usersRes.count || 0;
    const premiumCount = premiumRes.count || 0;
    const transactions = transRes.data || [];
    const totalRevenue = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);

    // Update dashboard cards
    const el = id => document.getElementById(id);
    if (el('dash-total-rounds')) el('dash-total-rounds').textContent = totalRounds;
    if (el('dash-pending')) el('dash-pending').textContent = pendingCount;
    if (el('dash-users')) el('dash-users').textContent = usersCount;
    if (el('dash-revenue')) el('dash-revenue').textContent = `$${(totalRevenue / 100).toFixed(2)}`;
    if (el('dash-promos')) el('dash-promos').textContent = premiumCount + ' premium';

    // Update nav badges
    if (el('nav-pending-badge')) el('nav-pending-badge').textContent = pendingCount;
    if (el('nav-active-badge')) el('nav-active-badge').textContent = totalRounds;

    // Revenue tab
    if (el('rev-total')) el('rev-total').textContent = `$${(totalRevenue / 100).toFixed(2)}`;
    const thisMonth = transactions.filter(t => new Date(t.created_at).getMonth() === new Date().getMonth());
    const monthRevenue = thisMonth.reduce((sum, t) => sum + (t.amount || 0), 0);
    if (el('rev-month')) el('rev-month').textContent = `$${(monthRevenue / 100).toFixed(2)}`;

    // Transaction list
    const txList = el('admin-transactions');
    if (txList && transactions.length > 0) {
      txList.innerHTML = transactions.slice(0, 20).map(t => `
        <div class="admin-card" style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px">
          <div>
            <div style="font-weight:600">$${(t.amount / 100).toFixed(2)} ${t.currency?.toUpperCase() || 'USD'}</div>
            <div style="font-size:0.75rem;color:var(--text-dim)">${new Date(t.created_at).toLocaleDateString()}</div>
          </div>
          <span class="admin-badge" style="background:${t.status==='completed'?'rgba(16,185,129,0.15);color:#10b981':'rgba(239,68,68,0.15);color:#ef4444'}">${t.status}</span>
        </div>`).join('');
    }

    // Recent activity
    const recent = el('dash-recent');
    if (recent && transactions.length > 0) {
      recent.innerHTML = transactions.slice(0, 5).map(t => `
        <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #2a2a3a;font-size:0.85rem">
          <span>Payment $${(t.amount / 100).toFixed(2)}</span>
          <span style="color:var(--text-dim)">${new Date(t.created_at).toLocaleDateString()}</span>
        </div>`).join('');
    }
  } catch (e) {
    console.error('Dashboard load error:', e);
  }
}

function bindAdminEvents() {
  // Sidebar navigation
  document.querySelectorAll('.admin-nav').forEach(nav => {
    nav.onclick = () => {
      document.querySelectorAll('.admin-nav').forEach(n => n.classList.remove('active'));
      document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
      nav.classList.add('active');
      currentTab = nav.dataset.tab;
      $(`#admin-tab-${currentTab}`)?.classList.add('active');
    };
  });

  // Create mode buttons
  document.querySelectorAll('.admin-mode-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.admin-mode-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      createMode = btn.dataset.mode;
    };
  });

  // Create round button
  $('#btn-admin-create').onclick = createRound;
}

// ---- Load Pending ----
async function loadPending() {
  const list = $('#admin-pending-list');

  if (isDemoMode) {
    // Load from localStorage
    const pending = JSON.parse(localStorage.getItem('ptw_pending_rounds') || '[]');
    if (pending.length === 0) {
      list.innerHTML = '<div class="admin-empty">No pending submissions</div>';
      $('#admin-pending-count').textContent = '0 pending';
      return;
    }
    list.innerHTML = pending.map((r, i) => renderPendingCard(r, i)).join('');
    $('#admin-pending-count').textContent = `${pending.length} pending`;
    bindPendingActions();
    return;
  }

  // Supabase
  const { data, error } = await supabase.from('pending_rounds').select('*').eq('status', 'pending').order('created_at', { ascending: false });
  if (error || !data) { list.innerHTML = '<div class="admin-empty">Error loading</div>'; return; }
  if (data.length === 0) { list.innerHTML = '<div class="admin-empty">No pending submissions</div>'; $('#admin-pending-count').textContent = '0 pending'; return; }
  list.innerHTML = data.map(r => renderPendingCard(r)).join('');
  $('#admin-pending-count').textContent = `${data.length} pending`;
  bindPendingActions();
}

function renderPendingCard(r, index) {
  const cc = getCountry(r.countryId || r.country_id);
  const countryName = cc ? `${cc.flag} ${cc.name}` : (r.countryId || r.country_id || '?');
  const mode = r.mode || 'places';
  const isPromo = r.isPromo || r.is_promo;
  const id = r.id || index;

  let promoHtml = '';
  if (isPromo && (r.promoData || r.promo_data)) {
    const pd = r.promoData || r.promo_data;
    const links = [pd.instagram, pd.whatsapp, pd.website, pd.phone].filter(Boolean).join(' · ');
    promoHtml = `<div class="admin-promo-detail"><strong>${pd.name}</strong>${pd.bio}<div class="admin-promo-links">${links}</div></div>`;
  }

  return `<div class="admin-card" data-id="${id}">
    <img class="admin-card-photo" src="${r.photoUrl || r.photo_url || 'https://picsum.photos/80'}" alt="" onerror="this.src='https://picsum.photos/80'" />
    <div class="admin-card-info">
      <div class="admin-card-title">${r.subdivisionName || r.subdivision_name || '?'}, ${countryName}</div>
      <div class="admin-card-meta">
        <span class="admin-card-badge badge-${mode}">${mode}</span>
        ${isPromo ? '<span class="admin-card-badge badge-promo">PROMO</span>' : ''}
        <span class="admin-card-badge badge-pending">pending</span>
        <span>by ${r.submitter || r.submitter_name || 'Anonymous'}</span>
      </div>
      ${promoHtml}
    </div>
    <div class="admin-card-actions">
      <button class="admin-btn admin-btn-approve" data-action="approve" data-id="${id}">Approve</button>
      <button class="admin-btn admin-btn-reject" data-action="reject" data-id="${id}">Reject</button>
    </div>
  </div>`;
}

function bindPendingActions() {
  document.querySelectorAll('[data-action="approve"]').forEach(btn => {
    btn.onclick = () => approveRound(btn.dataset.id);
  });
  document.querySelectorAll('[data-action="reject"]').forEach(btn => {
    btn.onclick = () => rejectRound(btn.dataset.id);
  });
}

// ---- Approve ----
async function approveRound(id) {
  if (isDemoMode) {
    const pending = JSON.parse(localStorage.getItem('ptw_pending_rounds') || '[]');
    const idx = typeof id === 'string' && id.startsWith('user_') ? pending.findIndex(r => r.id === id) : parseInt(id);
    if (idx < 0 || idx >= pending.length) return;
    const round = pending.splice(idx, 1)[0];
    round.status = 'approved';
    const active = JSON.parse(localStorage.getItem('ptw_active_rounds') || '[]');
    active.push(round);
    localStorage.setItem('ptw_pending_rounds', JSON.stringify(pending));
    localStorage.setItem('ptw_active_rounds', JSON.stringify(active));
    playSound('correct');
    loadPending();
    loadActive();
    return;
  }

  // Supabase: move from pending to rounds
  const { data: pending } = await supabase.from('pending_rounds').select('*').eq('id', id).single();
  if (!pending) return;

  await supabase.from('rounds').insert({
    country_id: pending.country_id,
    subdivision_id: pending.subdivision_id,
    subdivision_name: pending.subdivision_name,
    country_name: pending.country_name,
    mode: pending.mode,
    photo_url: pending.photo_url,
    difficulty: pending.difficulty,
    is_promo: pending.is_promo,
    promo_data: pending.promo_data,
    submitter_name: pending.submitter_name,
    submitter_id: pending.submitter_id,
    approved_at: new Date().toISOString(),
    active: true,
  });

  await supabase.from('pending_rounds').update({ status: 'approved' }).eq('id', id);
  playSound('correct');
  loadPending();
  loadActive();
}

// ---- Reject ----
async function rejectRound(id) {
  if (!confirm('Reject this submission?')) return;

  if (isDemoMode) {
    const pending = JSON.parse(localStorage.getItem('ptw_pending_rounds') || '[]');
    const idx = typeof id === 'string' && id.startsWith('user_') ? pending.findIndex(r => r.id === id) : parseInt(id);
    if (idx >= 0) pending.splice(idx, 1);
    localStorage.setItem('ptw_pending_rounds', JSON.stringify(pending));
    playSound('wrong');
    loadPending();
    return;
  }

  await supabase.from('pending_rounds').update({ status: 'rejected' }).eq('id', id);
  playSound('wrong');
  loadPending();
}

// ---- Load Active ----
async function loadActive() {
  const list = $('#admin-active-list');

  if (isDemoMode) {
    const active = JSON.parse(localStorage.getItem('ptw_active_rounds') || '[]');
    if (active.length === 0) { list.innerHTML = '<div class="admin-empty">No active rounds</div>'; $('#admin-active-count').textContent = '0 active'; return; }
    list.innerHTML = active.map((r, i) => renderActiveCard(r, i)).join('');
    $('#admin-active-count').textContent = `${active.length} active`;
    bindActiveActions();
    return;
  }

  const { data } = await supabase.from('rounds').select('*').order('created_at', { ascending: false }).limit(100);
  if (!data || data.length === 0) { list.innerHTML = '<div class="admin-empty">No active rounds</div>'; $('#admin-active-count').textContent = '0 active'; return; }
  list.innerHTML = data.map(r => renderActiveCard(r)).join('');
  $('#admin-active-count').textContent = `${data.length} active`;
  bindActiveActions();
}

function renderActiveCard(r, index) {
  const cc = getCountry(r.countryId || r.country_id);
  const countryName = cc ? `${cc.flag} ${cc.name}` : (r.countryId || r.country_id || '?');
  const mode = r.mode || 'places';
  const isActive = r.active !== false;
  const id = r.id || index;

  return `<div class="admin-card" data-id="${id}">
    <img class="admin-card-photo" src="${r.photoUrl || r.photo_url || 'https://picsum.photos/80'}" alt="" onerror="this.src='https://picsum.photos/80'" />
    <div class="admin-card-info">
      <div class="admin-card-title">${r.subdivisionName || r.subdivision_name || '?'}, ${countryName}</div>
      <div class="admin-card-meta">
        <span class="admin-card-badge badge-${mode}">${mode}</span>
        ${(r.isPromo || r.is_promo) ? '<span class="admin-card-badge badge-promo">PROMO</span>' : ''}
        <span>by ${r.submitter || r.submitter_name || 'Admin'}</span>
      </div>
    </div>
    <div class="admin-card-actions">
      <button class="admin-btn admin-btn-toggle ${isActive ? '' : 'inactive'}" data-action="toggle" data-id="${id}">${isActive ? 'Active' : 'Inactive'}</button>
      <button class="admin-btn admin-btn-delete" data-action="delete" data-id="${id}">Delete</button>
    </div>
  </div>`;
}

function bindActiveActions() {
  document.querySelectorAll('[data-action="toggle"]').forEach(btn => {
    btn.onclick = () => toggleRound(btn.dataset.id);
  });
  document.querySelectorAll('[data-action="delete"]').forEach(btn => {
    btn.onclick = () => deleteRound(btn.dataset.id);
  });
}

async function toggleRound(id) {
  if (isDemoMode) {
    const active = JSON.parse(localStorage.getItem('ptw_active_rounds') || '[]');
    const idx = parseInt(id);
    if (active[idx]) { active[idx].active = !active[idx].active; localStorage.setItem('ptw_active_rounds', JSON.stringify(active)); loadActive(); }
    return;
  }
  const { data } = await supabase.from('rounds').select('active').eq('id', id).single();
  if (data) { await supabase.from('rounds').update({ active: !data.active }).eq('id', id); loadActive(); }
}

async function deleteRound(id) {
  if (!confirm('Delete this round permanently?')) return;
  if (isDemoMode) {
    const active = JSON.parse(localStorage.getItem('ptw_active_rounds') || '[]');
    active.splice(parseInt(id), 1);
    localStorage.setItem('ptw_active_rounds', JSON.stringify(active));
    playSound('wrong');
    loadActive();
    return;
  }
  await supabase.from('rounds').delete().eq('id', id);
  playSound('wrong');
  loadActive();
}

// ---- Load Promos ----
async function loadPromos() {
  const list = $('#admin-promos-list');

  if (isDemoMode) {
    const all = [
      ...JSON.parse(localStorage.getItem('ptw_pending_rounds') || '[]'),
      ...JSON.parse(localStorage.getItem('ptw_active_rounds') || '[]'),
    ].filter(r => r.isPromo || r.is_promo);
    if (all.length === 0) { list.innerHTML = '<div class="admin-empty">No promo rounds</div>'; $('#admin-promo-count').textContent = '0 promos'; return; }
    list.innerHTML = all.map((r, i) => renderPendingCard(r, i)).join('');
    $('#admin-promo-count').textContent = `${all.length} promos`;
    return;
  }

  const { data } = await supabase.from('rounds').select('*').eq('is_promo', true).order('created_at', { ascending: false });
  if (!data || data.length === 0) { list.innerHTML = '<div class="admin-empty">No promo rounds</div>'; $('#admin-promo-count').textContent = '0 promos'; return; }
  list.innerHTML = data.map(r => renderActiveCard(r)).join('');
  $('#admin-promo-count').textContent = `${data.length} promos`;
}

// ---- Create Round ----
async function createRound() {
  const photoUrl = $('#admin-photo-url').value.trim();
  const countryId = $('#admin-country-id').value.trim().toLowerCase();
  const subdivId = $('#admin-subdiv-id').value.trim();
  const subdivName = $('#admin-subdiv-name').value.trim();
  const locationName = $('#admin-location-name').value.trim();
  const lat = parseFloat($('#admin-lat').value);
  const lng = parseFloat($('#admin-lng').value);

  if (!photoUrl || !countryId || !subdivId || !subdivName) {
    $('#admin-create-status').textContent = 'Fill all required fields';
    $('#admin-create-status').className = 'submit-status error';
    return;
  }

  const cc = getCountry(countryId);
  const round = {
    country_id: countryId,
    country_name: cc ? cc.name : countryId.toUpperCase(),
    subdivision_id: `${countryId}_${subdivId}`,
    subdivision_name: subdivName,
    mode: createMode,
    photo_url: photoUrl,
    difficulty: 'medium',
    active: true,
    is_promo: false,
    submitter_name: 'Admin',
    created_at: new Date().toISOString(),
  };

  if (isDemoMode) {
    const active = JSON.parse(localStorage.getItem('ptw_active_rounds') || '[]');
    round.id = `admin_${Date.now()}`;
    round.lat = lat;
    round.lng = lng;
    round.locationName = locationName;
    active.push(round);
    localStorage.setItem('ptw_active_rounds', JSON.stringify(active));
    playSound('perfect');
    $('#admin-create-status').textContent = 'Round created!';
    $('#admin-create-status').className = 'submit-status success';
    loadActive();
    return;
  }

  const { error } = await supabase.from('rounds').insert(round);
  if (error) {
    $('#admin-create-status').textContent = `Error: ${error.message}`;
    $('#admin-create-status').className = 'submit-status error';
    return;
  }
  playSound('perfect');
  $('#admin-create-status').textContent = 'Round created!';
  $('#admin-create-status').className = 'submit-status success';
  loadActive();
}
