// Tiny WebAudio sound effects for Twin Peeks — no audio files, everything is
// synthesized with oscillators so the game stays fully offline.

let audioCtx = null;
let enabled = true;

function context() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function tone(freq, startAt, dur, type, vol) {
  const ctx = context();
  if (!ctx || !enabled) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, ctx.currentTime + startAt);
  gain.gain.exponentialRampToValueAtTime(vol, ctx.currentTime + startAt + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startAt + dur);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime + startAt);
  osc.stop(ctx.currentTime + startAt + dur + 0.05);
}

export function setSoundEnabled(on) {
  enabled = on;
}

export function isSoundEnabled() {
  return enabled;
}

export function playFound() {
  tone(660, 0, 0.16, 'sine', 0.22);
  tone(880, 0.09, 0.22, 'sine', 0.22);
  tone(1320, 0.18, 0.28, 'sine', 0.16);
}

export function playWrong() {
  tone(180, 0, 0.18, 'sawtooth', 0.12);
  tone(140, 0.1, 0.22, 'sawtooth', 0.1);
}

export function playHint() {
  tone(520, 0, 0.12, 'triangle', 0.18);
  tone(780, 0.1, 0.16, 'triangle', 0.18);
}

export function playLevelClear() {
  [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.3, 'sine', 0.2));
}

export function playWin() {
  [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) => tone(f, i * 0.13, 0.34, 'sine', 0.2));
}

export function playTick() {
  tone(980, 0, 0.05, 'square', 0.05);
}
