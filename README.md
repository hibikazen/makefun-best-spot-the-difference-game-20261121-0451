[![make.fun](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/hibikazen/makefun-best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/hibikazen/makefun-best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

# Twin Peeks — Spot the Difference

An original spot-the-difference game for the [make.fun bounty](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451). Two pictures hang side by side; five little things changed in the right one. Hunt them down across three hand-drawn scenes — a cosy nook, a sunny garden, and a busy workshop — before the clock runs out.

## How to play

- Click a difference on either picture to ring it on both. A correct find scores **+100** points.
- A wrong click costs **15 points and 5 seconds**.
- Press **H** (or the Hint button) to circle one hidden difference — 3 hints per scene, 25 points each.
- Clear a scene with time to spare and bank **5 points a second**.
- **N** advances to the next scene, **R** restarts.

## Run it

The game is plain static files with no build step and no network requests — every picture is drawn in code on a canvas, and the sounds are synthesized with WebAudio.

```sh
node serve.ts
# open http://localhost:8080
```

Or serve `game/` with any static HTTP server and open `index.html`.

## Layout

- `game/index.html` — page, HUD and overlays
- `game/styles.css` — all styling
- `game/src/main.js` — bootstrap and test handle
- `game/src/game.js` — engine: scenes, timer, scoring, hints, markers
- `game/src/scenes.js` — the three scene painters and their five differences each
- `game/src/draw.js` — small canvas drawing helpers
- `game/src/audio.js` — synthesized sound effects
- `main.ts` — the make.fun entry program (copies `game/` and `screenshots/`, writes `dossier.json`)
- `screenshots/` — real gameplay renders taken with Playwright

Built as an entry for the make.fun best spot the difference game bounty.
