/* PinTheWorld — Google AdSense Rewarded Ads */

let adsReady = false;

export function initAds() {
  try {
    adConfig({
      sound: 'on',
      preloadAdBreaks: 'on',
      onReady: () => { adsReady = true; },
    });
  } catch (e) {
    console.warn('AdSense not available:', e);
  }
}

/**
 * Show a rewarded ad. Returns a promise that resolves to true if the user
 * watched the full ad, or false if dismissed / no ad available.
 */
export function showRewardedAd() {
  return new Promise((resolve) => {
    try {
      let adShown = false;

      adBreak({
        type: 'reward',
        name: 'extra-play',
        beforeReward: (showAdFn) => {
          // Ad is available — show it immediately (called from user click context)
          adShown = true;
          showAdFn();
        },
        adViewed: () => {
          // User watched the full ad — grant reward
          resolve(true);
        },
        adDismissed: () => {
          // User closed ad early — no reward
          resolve(false);
        },
        adBreakDone: (info) => {
          // If no ad was available at all
          if (!adShown) {
            resolve(false);
          }
        },
      });

      // Fallback timeout — if adBreak never fires callbacks (no ads available)
      setTimeout(() => {
        if (!adShown) resolve(false);
      }, 5000);

    } catch (e) {
      console.warn('Rewarded ad error:', e);
      resolve(false);
    }
  });
}
