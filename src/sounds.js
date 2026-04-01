/* Sound Effects (Web Audio API) — ported from CubanGuesser */

let audioCtx = null;

function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playTone(freq, duration, type, vol) {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.value = freq;
    gain.gain.value = vol || 0.15;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch (e) { /* silent if audio blocked */ }
}

export function playSound(type) {
  try {
    if (type === 'select') {
      playTone(600, 0.08, 'sine', 0.1);
    } else if (type === 'confirm') {
      playTone(500, 0.06, 'square', 0.08);
      setTimeout(() => playTone(700, 0.06, 'square', 0.08), 60);
    } else if (type === 'correct') {
      playTone(523, 0.15, 'sine', 0.12);
      setTimeout(() => playTone(659, 0.15, 'sine', 0.12), 120);
      setTimeout(() => playTone(784, 0.25, 'sine', 0.15), 240);
    } else if (type === 'perfect') {
      playTone(523, 0.12, 'sine', 0.15);
      setTimeout(() => playTone(659, 0.12, 'sine', 0.15), 100);
      setTimeout(() => playTone(784, 0.12, 'sine', 0.15), 200);
      setTimeout(() => playTone(1047, 0.35, 'sine', 0.18), 300);
    } else if (type === 'wrong') {
      playTone(200, 0.25, 'sawtooth', 0.08);
      setTimeout(() => playTone(160, 0.3, 'sawtooth', 0.06), 150);
    } else if (type === 'gameover') {
      playTone(392, 0.15, 'sine', 0.12);
      setTimeout(() => playTone(523, 0.15, 'sine', 0.12), 150);
      setTimeout(() => playTone(659, 0.15, 'sine', 0.12), 300);
      setTimeout(() => playTone(784, 0.4, 'sine', 0.18), 450);
    }
  } catch (e) { /* silent */ }
}
