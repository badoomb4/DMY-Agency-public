export const COLS = 60;
export const ROWS = 20;
export const CANVAS_W = 300;
export const CANVAS_H = 200;
export const PARTICLE_N = 100;
export const SPRITE_R = 12;
const ATTRACTOR_R = 10;
const LARGE_ATTRACTOR_R = 25;
const ATTRACTOR_FORCE_1 = 0.2;
const ATTRACTOR_FORCE_2 = 0.04;
const FIELD_OVERSAMPLE = 2;
export const FIELD_COLS = COLS * FIELD_OVERSAMPLE;
export const FIELD_ROWS = ROWS * FIELD_OVERSAMPLE;
const FIELD_SCALE_X = FIELD_COLS / CANVAS_W;
const FIELD_SCALE_Y = FIELD_ROWS / CANVAS_H;
const FIELD_DECAY = 0.8;

export type Particle = { x: number; y: number; vx: number; vy: number };

type FieldStamp = {
  radiusX: number; radiusY: number;
  sizeX: number; sizeY: number;
  values: Float32Array;
};

function spriteAlpha(d: number): number {
  if (d >= 1) return 0;
  if (d <= 0.35) return 0.45 + (0.15 - 0.45) * (d / 0.35);
  return 0.15 * (1 - (d - 0.35) / 0.65);
}

function createStamp(radiusPx: number): FieldStamp {
  const frx = radiusPx * FIELD_SCALE_X;
  const fry = radiusPx * FIELD_SCALE_Y;
  const rx = Math.ceil(frx);
  const ry = Math.ceil(fry);
  const sx = rx * 2 + 1;
  const sy = ry * 2 + 1;
  const v = new Float32Array(sx * sy);
  for (let y = -ry; y <= ry; y++) {
    for (let x = -rx; x <= rx; x++) {
      v[(y + ry) * sx + x + rx] = spriteAlpha(Math.sqrt((x / frx) ** 2 + (y / fry) ** 2));
    }
  }
  return { radiusX: rx, radiusY: ry, sizeX: sx, sizeY: sy, values: v };
}

const particleStamp = createStamp(SPRITE_R);
const largeStamp = createStamp(LARGE_ATTRACTOR_R);
const smallStamp = createStamp(ATTRACTOR_R);

export function createParticles(): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < PARTICLE_N; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = Math.random() * 40 + 20;
    particles.push({
      x: CANVAS_W / 2 + Math.cos(a) * r,
      y: CANVAS_H / 2 + Math.sin(a) * r,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
    });
  }
  return particles;
}

function splat(field: Float32Array, cx: number, cy: number, stamp: FieldStamp) {
  const gx = Math.round(cx * FIELD_SCALE_X);
  const gy = Math.round(cy * FIELD_SCALE_Y);
  for (let y = -stamp.radiusY; y <= stamp.radiusY; y++) {
    const gridY = gy + y;
    if (gridY < 0 || gridY >= FIELD_ROWS) continue;
    const fr = gridY * FIELD_COLS;
    const sr = (y + stamp.radiusY) * stamp.sizeX;
    for (let x = -stamp.radiusX; x <= stamp.radiusX; x++) {
      const gridX = gx + x;
      if (gridX < 0 || gridX >= FIELD_COLS) continue;
      const sv = stamp.values[sr + x + stamp.radiusX]!;
      if (sv === 0) continue;
      field[fr + gridX] = Math.min(1, field[fr + gridX]! + sv);
    }
  }
}

export function simulate(
  particles: Particle[],
  field: Float32Array,
  now: number,
): void {
  const a1x = Math.cos(now * 0.0007) * CANVAS_W * 0.25 + CANVAS_W / 2;
  const a1y = Math.sin(now * 0.0011) * CANVAS_H * 0.3 + CANVAS_H / 2;
  const a2x = Math.cos(now * 0.0013 + Math.PI) * CANVAS_W * 0.2 + CANVAS_W / 2;
  const a2y = Math.sin(now * 0.0009 + Math.PI) * CANVAS_H * 0.25 + CANVAS_H / 2;

  for (const p of particles) {
    const d1 = (a1x - p.x) ** 2 + (a1y - p.y) ** 2;
    const d2 = (a2x - p.x) ** 2 + (a2y - p.y) ** 2;
    const [ax, ay, dist] = d1 < d2
      ? [a1x - p.x, a1y - p.y, Math.sqrt(d1) + 1]
      : [a2x - p.x, a2y - p.y, Math.sqrt(d2) + 1];
    const f = d1 < d2 ? ATTRACTOR_FORCE_1 : ATTRACTOR_FORCE_2;
    p.vx = (p.vx + ax / dist * f + (Math.random() - 0.5) * 0.25) * 0.97;
    p.vy = (p.vy + ay / dist * f + (Math.random() - 0.5) * 0.25) * 0.97;
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < -SPRITE_R) p.x += CANVAS_W + SPRITE_R * 2;
    if (p.x > CANVAS_W + SPRITE_R) p.x -= CANVAS_W + SPRITE_R * 2;
    if (p.y < -SPRITE_R) p.y += CANVAS_H + SPRITE_R * 2;
    if (p.y > CANVAS_H + SPRITE_R) p.y -= CANVAS_H + SPRITE_R * 2;
  }

  for (let i = 0; i < field.length; i++) field[i] = field[i]! * FIELD_DECAY;
  for (const p of particles) splat(field, p.x, p.y, particleStamp);
  splat(field, a1x, a1y, largeStamp);
  splat(field, a2x, a2y, smallStamp);
}
