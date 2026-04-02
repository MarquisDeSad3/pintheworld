/* Auth module — Supabase Google OAuth + Guest mode */

import { supabase, isDemoMode } from './supabase.js';

let currentUser = null;
let authListeners = [];

export function onAuthChange(callback) {
  authListeners.push(callback);
}

function notifyListeners() {
  authListeners.forEach(cb => cb(currentUser));
}

export function getCurrentUser() {
  return currentUser;
}

export function isSignedIn() {
  return currentUser !== null && !currentUser.isGuest;
}

export async function initAuth() {
  if (isDemoMode) {
    // Demo mode — use guest
    currentUser = { id: 'guest', displayName: 'Guest', isGuest: true };
    notifyListeners();
    return;
  }

  // Listen for auth state changes
  supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user) {
      currentUser = {
        id: session.user.id,
        email: session.user.email,
        displayName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Player',
        avatarUrl: session.user.user_metadata?.avatar_url || null,
        isGuest: false,
      };
    } else {
      currentUser = { id: 'guest', displayName: 'Guest', isGuest: true };
    }
    notifyListeners();
  });

  // Check existing session
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) {
    currentUser = {
      id: session.user.id,
      email: session.user.email,
      displayName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Player',
      avatarUrl: session.user.user_metadata?.avatar_url || null,
      isGuest: false,
    };
  } else {
    currentUser = { id: 'guest', displayName: 'Guest', isGuest: true };
  }
  notifyListeners();
}

export async function signInWithGoogle() {
  if (isDemoMode) {
    currentUser = { id: 'demo_user', displayName: 'Demo User', isGuest: false };
    notifyListeners();
    return;
  }

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin },
  });
  if (error) console.error('Sign in error:', error);
}

export async function signOut() {
  // Clear premium cache on sign out
  localStorage.removeItem('ptw_premium');
  localStorage.removeItem('ptw_premium_ts');

  if (isDemoMode) {
    currentUser = { id: 'guest', displayName: 'Guest', isGuest: true };
    notifyListeners();
    return;
  }

  await supabase.auth.signOut();
  currentUser = { id: 'guest', displayName: 'Guest', isGuest: true };
  notifyListeners();
}
