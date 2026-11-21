// Twin Peeks bootstrap: wires the page's elements into the game engine and
// exposes a small test handle (window.SpotTest) so automated play-tests can
// read the state and drive the game without guessing at pixels.

import { TwinPeeksGame } from './game.js';
import { SCENES } from './scenes.js';

function byId(id) {
  return document.getElementById(id);
}

const elements = {
  left: byId('panel-left'),
  right: byId('panel-right'),
  leftWrap: byId('panel-left-wrap'),
  rightWrap: byId('panel-right-wrap'),
  sceneName: byId('scene-name'),
  sceneBlurb: byId('scene-blurb'),
  dots: byId('found-dots'),
  toast: byId('toast'),
  sceneValue: byId('hud-scene-value'),
  foundValue: byId('hud-found-value'),
  leftValue: byId('hud-left-value'),
  timerValue: byId('hud-timer-value'),
  timerBox: byId('hud-timer'),
  scoreValue: byId('hud-score-value'),
  hintCount: byId('hint-count'),
  hint: byId('btn-hint'),
  sound: byId('btn-sound'),
  play: byId('btn-play'),
  next: byId('btn-next'),
  again: byId('btn-again'),
  retry: byId('btn-retry'),
  levelTitle: byId('level-title'),
  levelText: byId('level-text'),
  levelBonus: byId('level-bonus'),
  levelTotal: byId('level-total'),
  finalScore: byId('final-score'),
  finalStats: byId('final-stats'),
  overText: byId('over-text'),
  overScore: byId('over-score'),
  overlays: {
    start: byId('overlay-start'),
    level: byId('overlay-level'),
    win: byId('overlay-win'),
    over: byId('overlay-over'),
  },
};

const game = new TwinPeeksGame(elements);

// Test handle for automated play-testing: reads state, clicks a difference by
// index through the same code path as a real mouse click, and can freeze the
// clock so screenshots stay still.
window.SpotTest = {
  state() {
    return {
      phase: game.phase,
      sceneIndex: game.sceneIndex,
      sceneName: game.scene.name,
      found: [...game.found].sort((a, b) => a - b),
      foundCount: game.found.size,
      score: game.score,
      timeLeft: Math.round(game.timeLeft),
      hintsLeft: game.hintsLeft,
      differences: game.scene.differences.map((d) => ({ x: d.x, y: d.y, r: d.r, label: d.label })),
    };
  },
  sceneCount() {
    return SCENES.length;
  },
  clickDifference(index) {
    const d = game.scene.differences[index];
    if (!d) return false;
    game.handleClick(d.x, d.y, elements.left);
    return true;
  },
  clickWrong() {
    // A spot with no difference on any scene: the top-left wall corner.
    game.handleClick(300, 30, elements.left);
    return true;
  },
  useHint() {
    game.useHint();
    return game.hintsLeft;
  },
  freezeClock() {
    game.paused = true;
  },
  unfreezeClock() {
    game.paused = false;
  },
  start() {
    game.startGame();
  },
};
