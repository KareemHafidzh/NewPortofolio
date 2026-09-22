// Geometry for the skills spiral: an Archimedean spiral squashed into an
// ellipse, matching the sketch — tail on the right, winding counter-clockwise
// inward to the centre. `t` runs 0 (outer tail, a logo has just entered) → 1
// (dead centre, the logo has faded out). All coordinates are % of the canvas
// box, so they drop straight into CSS left/top and into a 0–100 SVG viewBox.

export const TURNS = 2.4;    // full revolutions from tail to centre
export const GAP = 0.0625;   // t-distance between two consecutive logos (1/16)
export const RX = 44;        // ellipse radius X, % of the canvas
export const RY = 30;        // ellipse radius Y, % of the canvas

// The thread stops short of the newest logo by this much t, so its rounded cap
// sits in clear air instead of under the logo — the gap is what makes the end
// read as a drawn edge rather than a line that got cut off. A third of GAP
// clears the logo art itself at the size the logos are now drawn.
export const START_GAP = GAP / 3;

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

const trace = (
  from: number,
  to: number,
  steps: number,
  at: (t: number) => [number, number],
) => {
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const [x, y] = at(from + ((to - from) * i) / steps);
    d += `${i ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  return d;
};

// The silk itself, paid out behind the newest logo and wound in to the first.
export const webPath = (spiral: number, count: number) => {
  if (spiral <= 0) return "";
  const { inner, outer } = span(spiral, count);
  const from = outer + START_GAP;
  // Before the first logo has travelled past the gap there is nothing left to
  // draw — better an empty thread than one pointing backwards.
  if (inner <= from) return "";
  return trace(from, inner, WEB_STEPS, point);
};

// ─── DECORATIVE THREADS ───────────────────────────────────────────────
// Two companion lines that ride the same scroll but carry no logos. They are
// deliberately *not* clean spirals: a slow radial wobble pushes each loop in
// and out, so they read as doodled strokes around the coil rather than a
// second set of orbits competing with the real one.
//
// Each one runs in from off the right-hand edge before it reaches the coil, so
// it slides into frame instead of materialising in mid-air. The right is the
// only edge that is genuinely off-screen here: the coil is parked on the right
// half of the pane and the heading occupies the left.

// The t each stroke spends on that run-in. Negative because it happens before
// the spiral's own t = 0.
export const ENTRY = -0.22;

export interface Decor {
  scale: number;   // size against the skills coil
  turns: number;   // its own revolutions, off the coil's 2.4 so they never sync
  entry: number;   // angle it arrives on, radians; near 0 = off the right edge
  twist: number;   // radians the run-in swoops through, so it curves in rather
                   // than sliding down a ruler-straight radius
  reach: number;   // how many times its own radius out the run-in starts
  wobble: number;  // how far the radius breathes, as a fraction
  lobes: number;   // breaths per revolution
  drift: number;   // how much of the radius it keeps at the centre (0 = all in)
  lead: number;    // scroll offset — it starts later than the real thread
  trail: number;   // length of the drawn segment behind the head, in t
}

export const DECOR: Decor[] = [
  // Wide and lazy: enters high on the right, then one big wandering loop
  // outside the logos.
  { scale: 1.2, turns: 1.55, entry: 0.38, twist: 0.8, reach: 1.4,
    wobble: 0.26, lobes: 3, drift: 0.3, lead: 0.04, trail: 0.8 },
  // Tight and busy: enters low on the right, then a short scribble that cuts
  // across the middle. Small, so it needs a longer reach to clear the frame.
  { scale: 0.72, turns: 3.1, entry: -0.46, twist: -1, reach: 2.3,
    wobble: 0.2, lobes: 5, drift: 0.18, lead: 0.18, trail: 0.55 },
];

// Where the stroke has got to by t = 0, i.e. the angle the coil proper starts on.
const settled = (d: Decor) => d.entry + d.twist;

export const decorPoint = (t: number, d: Decor): [number, number] => {
  const phase = settled(d);
  let a: number;
  let shrink: number;
  if (t >= 0) {
    a = phase + d.turns * 2 * Math.PI * t;
    shrink = 1 - t * (1 - d.drift);
  } else {
    // The run-in. `u` is 1 at the far end and 0 where the coil takes over, so
    // both the radius and the angle land exactly on the t >= 0 branch.
    const u = clamp01(t / ENTRY);
    a = d.entry + (1 - u) * d.twist;
    shrink = 1 + u * (d.reach - 1);
  }
  const r = shrink * (1 + d.wobble * Math.sin(d.lobes * a + phase));
  return [50 + RX * d.scale * r * Math.cos(a), 50 - RY * d.scale * r * Math.sin(a)];
};

const DECOR_STEPS = 150;

// A comet: `head` chases the scroll from the off-screen start all the way in,
// `trail` is the tail it keeps behind it, so the stroke sweeps rather than
// growing out of a fixed anchor.
export const decorPath = (spiral: number, d: Decor) => {
  if (spiral <= d.lead) return "";
  const head = ENTRY + (1 - ENTRY) * clamp01((spiral - d.lead) / (1 - d.lead));
  // A stroke this short is a dot under a round cap, which looks like a stray
  // speck; wait until it is long enough to read as a line.
  if (head - ENTRY < 0.01) return "";
  const tail = Math.max(ENTRY, head - d.trail);
  return trace(tail, head, DECOR_STEPS, (t) => decorPoint(t, d));
};
