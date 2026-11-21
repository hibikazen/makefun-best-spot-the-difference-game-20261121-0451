// The three scenes of Twin Peeks. Each scene paints itself twice: variant 0 is the
// left picture, variant 1 is the right picture with five small changes. A difference
// is a spot on the picture (x, y, radius in the 560x420 scene space) plus a label
// shown when the player finds it.

import { circle, ring, rect, roundRect, ellipse, line, poly, star, petalFlower, text } from './draw.js';

// ---------- Scene 1: The Cosy Nook ----------

function paintNook(ctx, variant) {
  // Wall and floor
  rect(ctx, 0, 0, 560, 320, '#f6ddb4');
  rect(ctx, 0, 320, 560, 100, '#c08d55');
  line(ctx, 0, 320, 560, 320, '#a87a48', 3);
  // Rug
  ellipse(ctx, 280, 372, 195, 26, '#c65d21');
  ellipse(ctx, 280, 372, 150, 18, '#e9a13b');
  ellipse(ctx, 280, 372, 105, 11, '#f7ead7');

  // Window with sun and curtains
  rect(ctx, 36, 36, 140, 140, '#8a5a2b');
  rect(ctx, 44, 44, 124, 124, '#bfe3f0');
  circle(ctx, 106, 92, 22, '#f2c531');
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    line(ctx, 106 + Math.cos(a) * 26, 92 + Math.sin(a) * 26, 106 + Math.cos(a) * 34, 92 + Math.sin(a) * 34, '#f2c531', 3);
  }
  ellipse(ctx, 80, 140, 26, 10, '#ffffff');
  ellipse(ctx, 135, 125, 20, 8, '#ffffff');
  rect(ctx, 28, 30, 18, 152, '#d94f3d');
  rect(ctx, 170, 30, 18, 152, '#d94f3d');

  // Framed mountain picture
  rect(ctx, 210, 50, 100, 70, '#6b4a2f');
  rect(ctx, 218, 58, 84, 54, '#cfe8f5');
  poly(ctx, [[218, 112], [252, 72], [286, 112]], '#7ba05b');
  poly(ctx, [[252, 72], [262, 84], [244, 84]], '#ffffff');
  circle(ctx, 288, 70, 9, '#f2c531');

  // Wall clock — DIFFERENCE 1: the hands point to 3:00 on the left, 5:00 on the right
  circle(ctx, 470, 80, 30, '#6b4a2f');
  circle(ctx, 470, 80, 25, '#fff8ec');
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    circle(ctx, 470 + Math.cos(a) * 21, 80 + Math.sin(a) * 21, 1.6, '#2b2118');
  }
  if (variant === 0) {
    line(ctx, 470, 80, 488, 80, '#2b2118', 4);
    line(ctx, 470, 80, 470, 62, '#2b2118', 4);
  } else {
    line(ctx, 470, 80, 480, 95, '#2b2118', 4);
    line(ctx, 470, 80, 470, 62, '#2b2118', 4);
  }
  circle(ctx, 470, 80, 3, '#c0392b');

  // Bookshelf with books — DIFFERENCE 4: a red book is missing on the right
  rect(ctx, 380, 130, 140, 170, '#8a5a2b');
  rect(ctx, 388, 138, 124, 62, '#a9713f');
  rect(ctx, 388, 216, 124, 62, '#a9713f');
  const shelfBooks = ['#c0392b', '#2e6fb0', '#2e7d46', '#e9a13b', '#8e44ad'];
  let bx = 392;
  shelfBooks.forEach((color, i) => {
    if (variant === 1 && i === 2) return; // the green book vanished
    rect(ctx, bx, 148, 20, 44, color);
    bx += 23;
  });
  rect(ctx, 392, 228, 18, 42, '#c0392b');
  rect(ctx, 412, 228, 18, 42, '#2e7d46');
  rect(ctx, 432, 228, 18, 42, '#e9a13b');
  circle(ctx, 488, 250, 14, '#5fb3d9');
  rect(ctx, 484, 236, 8, 10, '#2e6fb0');

  // Sofa with cushions
  roundRect(ctx, 60, 250, 270, 70, 14, '#b4452f');
  roundRect(ctx, 60, 235, 270, 40, 12, '#c65d21');
  roundRect(ctx, 52, 250, 26, 85, 10, '#9c3a26');
  roundRect(ctx, 312, 250, 26, 85, 10, '#9c3a26');
  roundRect(ctx, 88, 258, 62, 34, 8, '#d96a4a');
  roundRect(ctx, 160, 258, 62, 34, 8, '#d96a4a');
  roundRect(ctx, 232, 258, 62, 34, 8, '#d96a4a');

  // Sleeping cat on the sofa — DIFFERENCE 2: the cat is gone on the right
  if (variant === 0) {
    ellipse(ctx, 268, 292, 34, 15, '#e8a34c');
    circle(ctx, 296, 282, 13, '#e8a34c');
    poly(ctx, [[288, 272], [292, 260], [297, 271]], '#e8a34c');
    poly(ctx, [[300, 271], [305, 260], [306, 272]], '#e8a34c');
    line(ctx, 238, 296, 214, 288, '#e8a34c', 7);
    line(ctx, 292, 284, 296, 284, '#2b2118', 2);
  }

  // Coffee table and mug — DIFFERENCE 3: the mug is red on the left, blue on the right
  rect(ctx, 352, 332, 150, 12, '#6b4a2f');
  rect(ctx, 362, 344, 10, 30, '#5a3d22');
  rect(ctx, 482, 344, 10, 30, '#5a3d22');
  const mugColor = variant === 0 ? '#c0392b' : '#2e6fb0';
  roundRect(ctx, 418, 306, 26, 24, 4, mugColor);
  ring(ctx, 447, 317, 8, mugColor, 4);
  ellipse(ctx, 431, 308, 11, 3, '#fff8ec');

  // Plant in the corner — DIFFERENCE 5: three blooms on the left, two on the right
  roundRect(ctx, 24, 356, 36, 30, 6, '#c65d21');
  line(ctx, 42, 356, 42, 300, '#2e7d46', 5);
  line(ctx, 42, 330, 26, 312, '#2e7d46', 4);
  line(ctx, 42, 330, 58, 312, '#2e7d46', 4);
  ellipse(ctx, 26, 308, 12, 6, '#3f9e57');
  ellipse(ctx, 58, 308, 12, 6, '#3f9e57');
  petalFlower(ctx, 30, 296, '#e86a92', '#f2c531');
  petalFlower(ctx, 56, 296, '#e86a92', '#f2c531');
  if (variant === 0) petalFlower(ctx, 43, 282, '#e86a92', '#f2c531');
}

// ---------- Scene 2: The Sunny Garden ----------

function paintGarden(ctx, variant) {
  // Sky, sun and clouds
  rect(ctx, 0, 0, 560, 260, '#aee3f5');
  rect(ctx, 0, 260, 560, 160, '#7ec850');
  rect(ctx, 0, 260, 560, 10, '#6db344');
  circle(ctx, 90, 70, 30, '#f7c531');
  // DIFFERENCE 1: the sun has rays on the left, none on the right
  if (variant === 0) {
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      line(ctx, 90 + Math.cos(a) * 36, 70 + Math.sin(a) * 36, 90 + Math.cos(a) * 46, 70 + Math.sin(a) * 46, '#f7c531', 4);
    }
  }
  ellipse(ctx, 240, 60, 34, 14, '#ffffff');
  ellipse(ctx, 262, 52, 24, 12, '#ffffff');
  ellipse(ctx, 430, 44, 30, 12, '#ffffff');
  ellipse(ctx, 452, 38, 22, 10, '#ffffff');

  // Big tree
  rect(ctx, 430, 130, 26, 150, '#8a5a2b');
  circle(ctx, 408, 108, 42, '#4e9e3f');
  circle(ctx, 470, 100, 46, '#5cb34c');
  circle(ctx, 440, 72, 44, '#6cc35a');
  circle(ctx, 420, 140, 20, '#f2c531');
  circle(ctx, 468, 132, 16, '#f2c531');

  // Birdhouse with a bird — DIFFERENCE 2: the bird is gone on the right
  rect(ctx, 386, 148, 34, 30, '#b4452f');
  poly(ctx, [[380, 150], [403, 132], [426, 150]], '#8a3a20');
  circle(ctx, 403, 164, 6, '#2b2118');
  if (variant === 0) {
    ellipse(ctx, 398, 138, 10, 7, '#2e6fb0');
    circle(ctx, 407, 133, 5, '#2e6fb0');
    poly(ctx, [[411, 133], [417, 135], [411, 137]], '#e9a13b');
  }

  // White picket fence
  rect(ctx, 0, 246, 560, 8, '#fff8ec');
  for (let x = 20; x < 560; x += 46) {
    poly(ctx, [[x, 216], [x + 8, 206], [x + 16, 216], [x + 16, 282], [x, 282]], '#fff8ec');
  }

  // Pond with a duck — DIFFERENCE 3: the duck is gone on the right
  ellipse(ctx, 280, 352, 112, 30, '#5fb3d9');
  ellipse(ctx, 280, 352, 92, 22, '#7cc4e6');
  line(ctx, 220, 348, 250, 348, '#ffffff', 2);
  line(ctx, 310, 360, 340, 360, '#ffffff', 2);
  if (variant === 0) {
    ellipse(ctx, 272, 342, 18, 11, '#f7d54a');
    circle(ctx, 288, 332, 9, '#f7d54a');
    poly(ctx, [[296, 332], [304, 335], [296, 338]], '#e9a13b');
    circle(ctx, 290, 330, 1.6, '#2b2118');
  }

  // Stepping stones
  ellipse(ctx, 120, 300, 22, 9, '#d9c9a8');
  ellipse(ctx, 180, 322, 22, 9, '#d9c9a8');
  ellipse(ctx, 250, 302, 22, 9, '#d9c9a8');
  ellipse(ctx, 400, 318, 22, 9, '#d9c9a8');

  // Tulip row — DIFFERENCE 4: a tulip is missing on the right
  const tulipX = [60, 110, 160, 210, 500];
  tulipX.forEach((x, i) => {
    if (variant === 1 && i === 2) return; // the middle tulip vanished
    line(ctx, x, 396, x, 366, '#2e7d46', 4);
    ellipse(ctx, x - 8, 382, 9, 5, '#2e7d46');
    poly(ctx, [[x - 9, 368], [x, 350], [x + 9, 368], [x + 6, 378], [x - 6, 378]], '#e84a5f');
  });

  // Butterfly — DIFFERENCE 5: orange wings on the left, purple on the right
  const wing = variant === 0 ? '#f28c28' : '#8e44ad';
  ellipse(ctx, 342, 196, 12, 16, wing);
  ellipse(ctx, 360, 196, 12, 16, wing);
  ellipse(ctx, 344, 214, 8, 10, wing);
  ellipse(ctx, 358, 214, 8, 10, wing);
  line(ctx, 351, 200, 351, 222, '#2b2118', 3);
  line(ctx, 351, 200, 344, 190, '#2b2118', 2);
  line(ctx, 351, 200, 358, 190, '#2b2118', 2);

  // Watering can
  roundRect(ctx, 470, 300, 44, 26, 6, '#2e6fb0');
  line(ctx, 470, 306, 446, 292, '#2e6fb0', 5);
  poly(ctx, [[446, 292], [438, 296], [446, 300]], '#2e6fb0');
  line(ctx, 514, 304, 526, 300, '#2b2118', 4);
}

// ---------- Scene 3: The Busy Workshop ----------

function paintWorkshop(ctx, variant) {
  // Wall, floor and pegboard
  rect(ctx, 0, 0, 560, 300, '#e8d9b8');
  rect(ctx, 0, 300, 560, 120, '#a97c50');
  line(ctx, 0, 300, 560, 300, '#8a5a2b', 3);
  rect(ctx, 40, 40, 260, 180, '#d9b98a');
  for (let gx = 60; gx <= 280; gx += 22) {
    for (let gy = 58; gy <= 200; gy += 22) {
      circle(ctx, gx, gy, 2, '#b98f5e');
    }
  }

  // Hammer — DIFFERENCE 1: the hammer is gone on the right
  if (variant === 0) {
    rect(ctx, 102, 108, 10, 62, '#8a5a2b');
    rect(ctx, 88, 92, 38, 20, '#5a5a5a');
    rect(ctx, 88, 92, 38, 8, '#7a7a7a');
  }
  // Wrench
  line(ctx, 180, 168, 180, 104, '#5a5a5a', 9);
  circle(ctx, 180, 96, 12, '#5a5a5a');
  circle(ctx, 180, 96, 6, '#d9b98a');
  // Saw
  poly(ctx, [[232, 130], [286, 150], [232, 168]], '#c8c8c8');
  rect(ctx, 224, 138, 14, 26, '#8a5a2b');

  // Shelf with jars — DIFFERENCE 3: a jar is missing on the right
  rect(ctx, 340, 96, 200, 12, '#8a5a2b');
  const jarX = [360, 420, 480];
  const jarColors = ['#e86a92', '#5fb3d9', '#7ec850'];
  jarX.forEach((x, i) => {
    if (variant === 1 && i === 1) return; // the blue jar vanished
    roundRect(ctx, x, 58, 30, 38, 5, jarColors[i]);
    rect(ctx, x + 4, 50, 22, 8, '#5a5a5a');
    rect(ctx, x + 6, 66, 18, 14, 'rgba(255,255,255,0.35)');
  });

  // Poster — DIFFERENCE 4: a rocket poster on the left, a star poster on the right
  rect(ctx, 340, 140, 100, 90, '#6b4a2f');
  if (variant === 0) {
    rect(ctx, 348, 148, 84, 74, '#2e6fb0');
    ellipse(ctx, 390, 182, 12, 24, '#e84a5f');
    poly(ctx, [[390, 152], [402, 172], [378, 172]], '#e84a5f');
    circle(ctx, 390, 184, 6, '#bfe3f0');
    poly(ctx, [[378, 200], [368, 214], [382, 206]], '#e9a13b');
    poly(ctx, [[402, 200], [412, 214], [398, 206]], '#e9a13b');
    text(ctx, 'ROCKET', 390, 216, 10, '#ffffff');
  } else {
    rect(ctx, 348, 148, 84, 74, '#f7ead7');
    star(ctx, 390, 182, 26, 11, 5, '#f2c531');
    text(ctx, 'STAR', 390, 216, 10, '#2b2118');
  }

  // Workbench
  rect(ctx, 40, 280, 480, 16, '#8a5a2b');
  rect(ctx, 56, 296, 14, 90, '#6b4a2f');
  rect(ctx, 490, 296, 14, 90, '#6b4a2f');
  rect(ctx, 70, 330, 420, 10, '#6b4a2f');

  // Toolbox — DIFFERENCE 5: open with tools on the left, closed on the right
  if (variant === 0) {
    roundRect(ctx, 140, 252, 70, 28, 5, '#c0392b');
    poly(ctx, [[140, 252], [150, 228], [200, 228], [210, 252]], '#a93226');
    line(ctx, 160, 228, 156, 210, '#5a5a5a', 5);
    line(ctx, 180, 228, 182, 208, '#e9a13b', 5);
    line(ctx, 196, 228, 202, 212, '#2e6fb0', 5);
  } else {
    roundRect(ctx, 140, 252, 70, 28, 5, '#c0392b');
    rect(ctx, 168, 246, 14, 8, '#5a5a5a');
  }

  // Radio
  roundRect(ctx, 280, 248, 64, 32, 6, '#2e7d46');
  circle(ctx, 296, 264, 9, '#f7ead7');
  circle(ctx, 326, 264, 6, '#f2c531');
  line(ctx, 336, 248, 352, 224, '#2b2118', 3);

  // Desk lamp — DIFFERENCE 2: the lamp shines on the left, dark on the right
  line(ctx, 470, 280, 470, 210, '#2b2118', 6);
  line(ctx, 470, 210, 448, 186, '#2b2118', 6);
  circle(ctx, 470, 280, 14, '#2b2118');
  poly(ctx, [[432, 190], [464, 190], [456, 168], [440, 168]], '#c0392b');
  if (variant === 0) {
    poly(ctx, [[436, 192], [460, 192], [486, 280], [414, 280]], 'rgba(242, 197, 49, 0.30)');
    circle(ctx, 448, 184, 7, '#f7e08a');
  } else {
    circle(ctx, 448, 184, 7, '#8a8a8a');
  }

  // Mug on the bench
  roundRect(ctx, 500, 258, 22, 22, 4, '#e9a13b');
  ring(ctx, 522, 268, 6, '#e9a13b', 3);

  // Stool
  circle(ctx, 90, 380, 26, '#8a5a2b');
  rect(ctx, 82, 380, 6, 36, '#6b4a2f');
  rect(ctx, 92, 380, 6, 36, '#6b4a2f');
}

// ---------- Scene table ----------

export const SCENES = [
  {
    id: 'nook',
    name: 'The Cosy Nook',
    blurb: 'Five things changed between the two pictures. Find them all before the clock runs out!',
    timeLimit: 120,
    paint: paintNook,
    differences: [
      { x: 470, y: 80, r: 30, label: 'The clock changed time' },
      { x: 285, y: 282, r: 32, label: 'The cat vanished' },
      { x: 431, y: 318, r: 16, label: 'The mug changed colour' },
      { x: 455, y: 160, r: 18, label: 'A book went missing' },
      { x: 43, y: 282, r: 20, label: 'A flower went missing' },
    ],
  },
  {
    id: 'garden',
    name: 'The Sunny Garden',
    blurb: 'A sunny garden, but look closer — five things are not the same on the right.',
    timeLimit: 120,
    paint: paintGarden,
    differences: [
      { x: 90, y: 70, r: 34, label: 'The sun lost its rays' },
      { x: 400, y: 138, r: 20, label: 'The bird flew away' },
      { x: 280, y: 340, r: 26, label: 'The duck swam off' },
      { x: 160, y: 368, r: 16, label: 'A tulip went missing' },
      { x: 351, y: 204, r: 18, label: 'The butterfly changed colour' },
    ],
  },
  {
    id: 'workshop',
    name: 'The Busy Workshop',
    blurb: 'The workshop hides its secrets well. Five differences — sharper eyes needed now.',
    timeLimit: 120,
    paint: paintWorkshop,
    differences: [
      { x: 107, y: 120, r: 24, label: 'The hammer vanished' },
      { x: 448, y: 182, r: 26, label: 'The lamp went dark' },
      { x: 435, y: 72, r: 18, label: 'A jar went missing' },
      { x: 390, y: 185, r: 30, label: 'The poster changed' },
      { x: 175, y: 248, r: 28, label: 'The toolbox closed' },
    ],
  },
];
