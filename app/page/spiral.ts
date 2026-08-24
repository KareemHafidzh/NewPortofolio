// Geometry for the skills spiral: an Archimedean spiral squashed into an
// ellipse, matching the sketch — tail on the right, winding counter-clockwise
// inward to the centre. `t` runs 0 (outer tail, a logo has just entered) → 1
// (dead centre, the logo has faded out). All coordinates are % of the canvas
// box, so they drop straight into CSS left/top and into a 0–100 SVG viewBox.

export const TURNS = 2.4;    // full revolutions from tail to centre
export const GAP = 0.0625;   // t-distance between two consecutive logos (1/16)
export const RX = 44;        // ellipse radius X, % of the canvas
export const RY = 30;        // ellipse radius Y, % of the canvas

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export const point = (t: number): [number, number] => {
  const a = TURNS * 2 * Math.PI * t;
  return [50 + RX * (1 - t) * Math.cos(a), 50 - RY * (1 - t) * Math.sin(a)];
};

// The stretch of spiral the visible logos occupy: `inner` is where the first
// logo has got to, `outer` is where the newest one entered.
export const span = (spiral: number, count: number) => ({
  inner: clamp01(spiral),
  outer: Math.max(0, spiral - (count - 1) * GAP),
});

const WEB_STEPS = 160;

// The silk itself, paid out behind the newest logo and wound in to the first.
export const webPath = (spiral: number, count: number) => {
  if (spiral <= 0) return "";
  const { inner, outer } = span(spiral, count);
  let d = "";
  for (let i = 0; i <= WEB_STEPS; i++) {
    const [x, y] = point(outer + ((inner - outer) * i) / WEB_STEPS);
    d += `${i ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  return d;
};
