// Twin Peeks game engine: scene flow, timer, scoring, clicks, hints and markers.
// The two canvases always show the same scene — variant 0 on the left, variant 1
// on the right — so a difference found on either panel is ringed on both.

import { SCENES } from './scenes.js';
import { circle, ring, line, text } from './draw.js';
import {
  setSoundEnabled,
  isSoundEnabled,
  playFound,
  playWrong,
  playHint,
  playLevelClear,
  playWin,
  playTick,
} from './audio.js';

const FIND_POINTS = 100;
const WRONG_POINTS = 15;
const WRONG_SECONDS = 5;
const HINT_POINTS = 25;
const TIME_BONUS_PER_SECOND = 5;

export class TwinPeeksGame {
  constructor(elements) {
    this.el = elements;
    this.leftCtx = elements.left.getContext('2d');
    this.rightCtx = elements.right.getContext('2d');
    this.sceneIndex = 0;
    this.found = new Set();
    this.score = 0;
    this.totalFound = 0;
    this.wrongClicks = 0;
    this.hintsUsed = 0;
    this.hintsLeft = 3;
    this.timeLeft = 0;
    this.phase = 'start'; // start | playing | level | win | over
    this.hintSpot = null;
    this.hintUntil = 0;
    this.wrongMarks = [];
    this.lastTickSecond = -1;
    this.paused = false;
    this.raf = 0;
    this.lastFrame = 0;
    this.bindEvents();
    this.showStart();
    this.loop = this.loop.bind(this);
    this.raf = requestAnimationFrame(this.loop);
  }

  get scene() {
    return SCENES[this.sceneIndex];
  }

  // ---------- wiring ----------

  bindEvents() {
    const clickAt = (canvas, ev) => {
      if (this.phase !== 'playing' || this.paused) return;
      const rect = canvas.getBoundingClientRect();
      const x = ((ev.clientX - rect.left) / rect.width) * 560;
      const y = ((ev.clientY - rect.top) / rect.height) * 420;
      this.handleClick(x, y, canvas);
    };
    this.el.left.addEventListener('click', (ev) => clickAt(this.el.left, ev));
    this.el.right.addEventListener('click', (ev) => clickAt(this.el.right, ev));
    this.el.play.addEventListener('click', () => this.startGame());
    this.el.next.addEventListener('click', () => this.nextScene());
    this.el.again.addEventListener('click', () => this.startGame());
    this.el.retry.addEventListener('click', () => this.startGame());
    this.el.hint.addEventListener('click', () => this.useHint());
    this.el.sound.addEventListener('click', () => {
      setSoundEnabled(!isSoundEnabled());
      this.el.sound.textContent = isSoundEnabled() ? 'Sound: on' : 'Sound: off';
    });
    window.addEventListener('keydown', (ev) => {
      if (ev.key === 'h' || ev.key === 'H') this.useHint();
      if (ev.key === 'n' || ev.key === 'N') {
        if (this.phase === 'level') this.nextScene();
      }
      if (ev.key === 'r' || ev.key === 'R') {
        if (this.phase === 'playing' || this.phase === 'over') this.startGame();
      }
      if (ev.key === 'Enter' && this.phase === 'start') this.startGame();
    });
  }

  // ---------- flow ----------

  showStart() {
    this.phase = 'start';
    this.sceneIndex = 0;
    this.found = new Set();
    this.score = 0;
    this.totalFound = 0;
    this.wrongClicks = 0;
    this.hintsUsed = 0;
    this.timeLeft = this.scene.timeLimit;
    this.updateHud();
    this.showOverlay('start');
  }

  startGame() {
    this.sceneIndex = 0;
    this.score = 0;
    this.totalFound = 0;
    this.wrongClicks = 0;
    this.hintsUsed = 0;
    this.beginScene();
  }

  beginScene() {
    this.found = new Set();
    this.hintsLeft = 3;
    this.hintSpot = null;
    this.wrongMarks = [];
    this.timeLeft = this.scene.timeLimit;
    this.lastTickSecond = -1;
    this.phase = 'playing';
    this.el.sceneName.textContent = this.scene.name;
    this.el.sceneBlurb.textContent = this.scene.blurb;
    this.el.hint.disabled = false;
    this.hideOverlays();
    this.updateHud();
    this.setToast('');
  }

  nextScene() {
    if (this.sceneIndex + 1 >= SCENES.length) {
      this.finishGame();
      return;
    }
    this.sceneIndex++;
    this.beginScene();
  }

  finishGame() {
    this.phase = 'win';
    this.el.finalScore.textContent = String(this.score);
    this.el.finalStats.innerHTML =
      `15 differences found &middot; ${this.wrongClicks} wrong click${this.wrongClicks === 1 ? '' : 's'} &middot; ${this.hintsUsed} hint${this.hintsUsed === 1 ? '' : 's'} used`;
    this.showOverlay('win');
    playWin();
  }

  gameOver() {
    this.phase = 'over';
    const remaining = this.scene.differences.length - this.found.size;
    this.el.overText.textContent = `You found ${this.found.size} of 5 in ${this.scene.name} — ${remaining} difference${remaining === 1 ? '' : 's'} still hiding.`;
    this.el.overScore.textContent = String(this.score);
    this.showOverlay('over');
  }

  // ---------- play ----------

  handleClick(x, y, canvas) {
    const hit = this.scene.differences.findIndex((d, i) => {
      if (this.found.has(i)) return false;
      const dx = x - d.x;
      const dy = y - d.y;
      return dx * dx + dy * dy <= d.r * d.r;
    });
    if (hit >= 0) {
      this.found.add(hit);
      this.totalFound++;
      this.score += FIND_POINTS;
      playFound();
      this.setToast(this.scene.differences[hit].label + ' — +100');
      this.updateHud();
      if (this.found.size === this.scene.differences.length) {
        this.levelCleared();
      }
      return;
    }
    this.wrongClicks++;
    this.score = Math.max(0, this.score - WRONG_POINTS);
    this.timeLeft = Math.max(0, this.timeLeft - WRONG_SECONDS);
    playWrong();
    this.wrongMarks.push({ x, y, side: canvas === this.el.left ? 'left' : 'right', until: performance.now() + 700 });
    const wrap = canvas === this.el.left ? this.el.leftWrap : this.el.rightWrap;
    wrap.classList.remove('flash-wrong');
    void wrap.offsetWidth;
    wrap.classList.add('flash-wrong');
    this.setToast(`Not a difference — −15 points, −5 seconds`, true);
    this.updateHud();
  }

  levelCleared() {
    const bonus = Math.round(this.timeLeft) * TIME_BONUS_PER_SECOND;
    this.score += bonus;
    this.phase = 'level';
    this.el.levelTitle.textContent = `Scene ${this.sceneIndex + 1} complete!`;
    this.el.levelText.textContent = `You found all five differences in ${this.scene.name}.`;
    this.el.levelBonus.textContent = `+${bonus}`;
    this.el.levelTotal.textContent = String(this.score);
    this.el.next.textContent = this.sceneIndex + 1 >= SCENES.length ? 'See your score' : 'Next scene';
    this.showOverlay('level');
    playLevelClear();
    this.updateHud();
  }

  useHint() {
    if (this.phase !== 'playing' || this.paused) return;
    if (this.hintsLeft <= 0) {
      this.setToast('No hints left in this scene', true);
      return;
    }
    const remaining = this.scene.differences
      .map((d, i) => i)
      .filter((i) => !this.found.has(i));
    if (remaining.length === 0) return;
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    this.hintSpot = this.scene.differences[pick];
    this.hintUntil = performance.now() + 2600;
    this.hintsLeft--;
    this.hintsUsed++;
    this.score = Math.max(0, this.score - HINT_POINTS);
    playHint();
    this.setToast('Hint: look inside the pulsing ring — −25 points');
    this.updateHud();
  }

  // ---------- HUD and overlays ----------

  updateHud() {
    const left = this.scene.differences.length - this.found.size;
    this.el.sceneValue.textContent = `${this.sceneIndex + 1} / ${SCENES.length}`;
    this.el.foundValue.textContent = `${this.found.size} / ${this.scene.differences.length}`;
    this.el.leftValue.textContent = String(left);
    this.el.scoreValue.textContent = String(this.score);
    this.el.hintCount.textContent = String(this.hintsLeft);
    this.el.hint.disabled = this.hintsLeft <= 0 || this.phase !== 'playing';
    this.el.dots.innerHTML = this.scene.differences
      .map((_, i) => `<span class="dot${this.found.has(i) ? ' hit' : ''}"></span>`)
      .join('');
    const t = Math.max(0, Math.ceil(this.timeLeft));
    this.el.timerValue.textContent = `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
    this.el.timerBox.classList.toggle('low', this.phase === 'playing' && this.timeLeft <= 15);
  }

  setToast(msg, bad) {
    this.el.toast.textContent = msg;
    this.el.toast.classList.toggle('bad', Boolean(bad));
  }

  showOverlay(name) {
    for (const key of ['start', 'level', 'win', 'over']) {
      this.el.overlays[key].classList.toggle('hidden', key !== name);
    }
  }

  hideOverlays() {
    for (const key of ['start', 'level', 'win', 'over']) {
      this.el.overlays[key].classList.add('hidden');
    }
  }

  // ---------- frame loop ----------

  loop(now) {
    const dt = Math.min(0.1, (now - this.lastFrame) / 1000 || 0);
    this.lastFrame = now;
    if (this.phase === 'playing' && !this.paused) {
      this.timeLeft -= dt;
      const whole = Math.ceil(this.timeLeft);
      if (whole !== this.lastTickSecond) {
        this.lastTickSecond = whole;
        if (whole <= 10 && whole > 0) playTick();
        this.updateHud();
      }
      if (this.timeLeft <= 0) {
        this.timeLeft = 0;
        this.updateHud();
        this.gameOver();
      }
    }
    this.render(now);
    this.raf = requestAnimationFrame(this.loop);
  }

  render(now) {
    this.scene.paint(this.leftCtx, 0);
    this.scene.paint(this.rightCtx, 1);
    this.drawMarkers(this.leftCtx, now, 'left');
    this.drawMarkers(this.rightCtx, now, 'right');
    if (this.phase === 'start') {
      this.dimPanel(this.leftCtx, 'Click Start hunting to play');
      this.dimPanel(this.rightCtx, 'Three scenes await');
    }
  }

  dimPanel(ctx, label) {
    ctx.fillStyle = 'rgba(43, 33, 24, 0.25)';
    ctx.fillRect(0, 0, 560, 420);
    text(ctx, label, 280, 210, 22, '#fff8ec');
  }

  drawMarkers(ctx, now, side) {
    // Found differences: green ring + check on both panels
    this.found.forEach((i) => {
      const d = this.scene.differences[i];
      const pulse = 1 + Math.sin(now / 300) * 0.08;
      ring(ctx, d.x, d.y, d.r * pulse, '#2e7d46', 5);
      ring(ctx, d.x, d.y, d.r * pulse + 6, 'rgba(255,255,255,0.85)', 2);
      circle(ctx, d.x + d.r * 0.62, d.y - d.r * 0.62, 11, '#2e7d46');
      text(ctx, '✓', d.x + d.r * 0.62, d.y - d.r * 0.62 + 1, 14, '#ffffff');
    });
    // Active hint: pulsing gold ring
    if (this.hintSpot && now < this.hintUntil) {
      const d = this.hintSpot;
      const pulse = 1 + Math.sin(now / 160) * 0.18;
      ring(ctx, d.x, d.y, (d.r + 8) * pulse, '#e9a13b', 5);
      ring(ctx, d.x, d.y, (d.r + 16) * pulse, 'rgba(233, 161, 59, 0.45)', 3);
    } else if (this.hintSpot) {
      this.hintSpot = null;
    }
    // Wrong-click crosses, fading out
    this.wrongMarks = this.wrongMarks.filter((m) => now < m.until);
    for (const m of this.wrongMarks.filter((w) => w.side === side)) {
      const a = Math.max(0, (m.until - now) / 700);
      ctx.save();
      ctx.globalAlpha = a;
      line(ctx, m.x - 12, m.y - 12, m.x + 12, m.y + 12, '#c0392b', 5);
      line(ctx, m.x - 12, m.y + 12, m.x + 12, m.y - 12, '#c0392b', 5);
      ctx.restore();
    }
  }
}
