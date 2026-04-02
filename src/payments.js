/* PinTheWorld — Stripe Payments */

import { supabase, isDemoMode } from './supabase.js';
import { getCurrentUser, isSignedIn } from './auth.js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';

/**
 * Check if current user is premium.
 * Always verifies against Supabase — localStorage is only a short-lived cache
 * to avoid re-checking on every UI render (expires after 5 minutes).
 */
export async function checkPremium() {
  if (!isSignedIn() || isDemoMode || !supabase) {
    // Guests and demo mode are never premium
    localStorage.removeItem('ptw_premium');
    localStorage.removeItem('ptw_premium_ts');
    return false;
  }

  // Use cache only if verified within the last 5 minutes
  const cachedTs = parseInt(localStorage.getItem('ptw_premium_ts') || '0', 10);
  if (localStorage.getItem('ptw_premium') === 'true' && Date.now() - cachedTs < 5 * 60 * 1000) {
    return true;
  }

  // Always verify with Supabase
  try {
    const user = getCurrentUser();
    if (!user || user.isGuest) return false;

    const { data } = await supabase
      .from('profiles')
      .select('is_premium')
      .eq('id', user.id)
      .single();

    if (data?.is_premium) {
      localStorage.setItem('ptw_premium', 'true');
      localStorage.setItem('ptw_premium_ts', String(Date.now()));
      return true;
    }

    // Server says not premium — clear any spoofed cache
    localStorage.removeItem('ptw_premium');
    localStorage.removeItem('ptw_premium_ts');
  } catch (e) {
    console.error('Premium check error:', e);
  }
  return false;
}

/**
 * Start a Stripe Checkout session.
 * @param {'premium'|'promo_people'|'promo_business'} type
 * @param {string} [roundId] — required for promo types
 * @returns {Promise<string|null>} checkout URL or null on error
 */
export async function startCheckout(type, roundId) {
  if (!supabase || isDemoMode) {
    console.warn('Payments not available in demo mode');
    return null;
  }

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    console.error('No auth session');
    return null;
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/create-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ type, roundId }),
    });

    const data = await res.json();
    if (data.error) {
      console.error('Checkout error:', data.error);
      return null;
    }

    return data.url;
  } catch (e) {
    console.error('Checkout request failed:', e);
    return null;
  }
}

/**
 * Redirect to Stripe Checkout for premium purchase.
 */
export async function buyPremium() {
  const url = await startCheckout('premium');
  if (url) window.location.href = url;
  return !!url;
}

/**
 * Redirect to Stripe Checkout for promo payment.
 */
export async function payPromo(mode, roundId) {
  const type = mode === 'people' ? 'promo_people' : 'promo_business';
  const url = await startCheckout(type, roundId);
  if (url) window.location.href = url;
  return !!url;
}

/**
 * Handle payment return (check URL params after Stripe redirect).
 */
export function handlePaymentReturn() {
  const params = new URLSearchParams(window.location.search);
  const payment = params.get('payment');
  const type = params.get('type');

  if (!payment) return null;

  // Clean URL
  window.history.replaceState({}, '', window.location.pathname + window.location.hash);

  if (payment === 'success') {
    if (type === 'premium') {
      localStorage.setItem('ptw_premium', 'true');
      localStorage.setItem('ptw_premium_ts', String(Date.now()));
    }
    return { success: true, type };
  }
  return { success: false, type };
}
