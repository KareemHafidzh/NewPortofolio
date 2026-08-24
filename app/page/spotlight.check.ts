// Run: node app/page/spotlight.check.ts
import assert from "node:assert/strict";
import {
  approach,
  BLOB_LOBES,
  blobLobes,
  blobPhases,
  clampToFigure,
  constrainLobe,
  driftTarget,
  eccentricity,
  FIGURE,
  MAX_LOBE_REACH,
  rectDistance,
  spring,
} from "./spotlight.ts";

// ── the blob is not a circle ────────────────────────────────────────────────
// The one that actually matters. Two earlier versions of this shape passed
// every other assertion here while rendering as a perfect disc, because nothing
// measured roundness — connectivity and non-repetition are both perfectly happy
// with a circle. Eccentricity is max/min outline radius over a full turn, so
// 1.0 is a circle and this fails the moment the lobes average back out.
{
  let worst = Infinity;
  let total = 0;
  let samples = 0;
  for (let seed = 0; seed < 8; seed++) {
    const phases = blobPhases(() => (seed * 0.618033 + 0.137) % 1);
    for (let t = 0; t < 60; t += 0.25) {
      const e = eccentricity(blobLobes(t, phases));
      worst = Math.min(worst, e);
      total += e;
      samples++;
    }
  }
  assert.ok(worst >= 1.25, `blob went round: eccentricity dropped to ${worst.toFixed(3)}`);
  assert.ok(
    total / samples >= 1.7,
    `blob is too round on average: ${(total / samples).toFixed(3)}`,
  );
}

// ── the blob is always one soft blob, never islands or a plain circle ────────
// Swept over phases as well as time, because the phases are random per mount:
// a shape that only holds together for the phases I happened to see is no good.
for (let seed = 0; seed < 12; seed++) {
  const phases = blobPhases(() => (seed * 0.618033 + 0.137) % 1);
  for (let t = 0; t < 120; t += 0.05) {
    const lobes = blobLobes(t, phases);
    assert.equal(lobes.length, BLOB_LOBES, "every lobe accounted for");

    const centre = lobes[0];
    assert.ok(centre.x === 0 && centre.y === 0, "lobe 0 anchors the blob");

    lobes.forEach((lobe, i) => {
      assert.ok(lobe.r > 0, `lobe ${i} inverted at t=${t}: r=${lobe.r}`);

      // Stays inside the spotlight radius, so clampToFigure still means what it
      // says and the blob can't bulge off the person.
      const extent = Math.hypot(lobe.x, lobe.y) + lobe.r;
      assert.ok(extent <= 1, `lobe ${i} escaped the radius at t=${t}: ${extent}`);

      if (i === 0) return;
      const gap = Math.hypot(lobe.x, lobe.y);

      // Overlaps the centre with room to spare. Merely touching would leave a
      // visible pinch where the two circles meet; this demands they properly
      // merge, which is what reads as one organic shape instead of a bunch of
      // circles.
      assert.ok(
        gap < 0.85 * (lobe.r + centre.r),
        `lobe ${i} only grazes the centre at t=${t}: ${gap} vs ${lobe.r + centre.r}`,
      );

      // …but never so deep that the centre swallows it. A swallowed lobe stops
      // contributing to the outline, and if they all tuck in at once the union
      // is just the centre circle. This is the direct cause of the perfect
      // circle that shipped twice.
      assert.ok(
        gap + lobe.r > centre.r,
        `lobe ${i} was swallowed by the centre at t=${t}: reaches ${gap + lobe.r} vs ${centre.r}`,
      );
    });
  }
}

// ── the shape genuinely keeps changing ──────────────────────────────────────
// Guards the actual request: no fixed shape. Harmonic periods would collapse
// this to roughly one cycle's worth of poses — around 60 rather than ~3000 — so
// this fails loudly if anyone later "tidies" the frequencies into multiples.
// Note it does NOT assert the blob never revisits a pose: these orbits pass
// within 0.0003 of their starting shape inside this window. Quasi-periodic
// motion always recurs eventually; what matters is that the cycle is far longer
// than anyone will sit and watch.
{
  const phases = blobPhases(() => 0.3);
  const seen = new Set<string>();
  for (let t = 0; t < 300; t += 0.1) {
    seen.add(
      blobLobes(t, phases)
        .map((l) => `${l.x.toFixed(3)},${l.y.toFixed(3)},${l.r.toFixed(3)}`)
        .join("|"),
    );
  }
  assert.ok(seen.size > 2900, `blob settled into a loop: only ${seen.size} distinct poses`);
}

// ── the drift never wanders off the figure, so clamping it is a no-op ────────
for (let t = 0; t < 200; t += 0.01) {
  const p = driftTarget(t);
  assert.deepEqual(clampToFigure(p), p, `drift escaped the figure at t=${t}`);
}

// ── the cursor, which can be anywhere, gets pinned to the figure ─────────────
assert.deepEqual(
  clampToFigure({ x: -3, y: 9 }),
  { x: FIGURE.minX, y: FIGURE.maxY },
  "a cursor far outside pins to the nearest corner of the figure",
);
assert.deepEqual(
  clampToFigure({ x: 0.05, y: 0.5 }),
  { x: FIGURE.minX, y: 0.5 },
  "hovering the transparent left margin only clamps x, y is left alone",
);
const inside = { x: 0.5, y: 0.5 };
assert.deepEqual(clampToFigure(inside), inside, "a target on the figure is untouched");

// ── radar distance: 0 inside, exact on the sides, pythagorean at corners ─────
const box = { left: 100, right: 200, top: 50, bottom: 150 };
assert.equal(rectDistance(150, 100, box), 0, "inside the box must read 0");
assert.equal(rectDistance(100, 50, box), 0, "the corner itself is inside");
assert.equal(rectDistance(80, 100, box), 20, "straight out from the left edge");
assert.equal(rectDistance(230, 100, box), 30, "straight out from the right edge");
assert.equal(rectDistance(150, 20, box), 30, "straight up from the top edge");
assert.equal(rectDistance(150, 200, box), 50, "straight down from the bottom edge");
assert.equal(rectDistance(97, 46, box), 5, "past a corner is the diagonal, 3-4-5");

// ── the springs are fluid, and stable ───────────────────────────────────────
// Overshoot is the point: it is what separates a wobble from a slide. If a
// future tweak damps these to the point they stop overshooting, the blob goes
// stiff again and this fails.
for (let i = 0; i < BLOB_LOBES; i++) {
  const stiffness = 0.14 * (1 - 0.13 * i);
  let position = 0;
  let velocity = 0;
  let peak = 0;
  for (let frame = 0; frame < 600; frame++) {
    ({ position, velocity } = spring(position, velocity, 1, stiffness, 0.76));
    peak = Math.max(peak, position);
    assert.ok(Number.isFinite(position) && Math.abs(position) < 5, `lobe ${i} spring diverged`);
  }
  assert.ok(peak > 1.05, `lobe ${i} spring barely overshoots (${peak.toFixed(3)}) — reads as stiff`);
  assert.ok(Math.abs(position - 1) < 1e-3, `lobe ${i} spring never settled: ${position}`);
}
// …and they must not all move alike, or the blob slides rigidly again
{
  const overshoot = (stiffness: number) => {
    let position = 0;
    let velocity = 0;
    let peak = 0;
    for (let frame = 0; frame < 200; frame++) {
      ({ position, velocity } = spring(position, velocity, 1, stiffness, 0.76));
      peak = Math.max(peak, position);
    }
    return peak;
  };
  const first = overshoot(0.14);
  const last = overshoot(0.14 * (1 - 0.13 * (BLOB_LOBES - 1)));
  assert.ok(first - last > 0.05, "lobes respond too alike to read as fluid");
}

// ── the blob deforms when thrown, rather than sliding rigidly ───────────────
// Replays the loop's maths over a fast cursor move. The failure this guards is
// subtle: with every lobe pinned at a fixed offset from one centre the blob is
// still perfectly blob-shaped and still animates, it just travels as a solid
// object — which reads as stiff. So assert the shape actually responds to
// motion, not merely that it has a shape.
{
  const W = 540;
  const H = 675;
  const R = W * 0.22;
  const phases = blobPhases(() => 0.42);

  let x = 0.5;
  let y = 0.5;
  let t = 0;
  const trail = blobLobes(0, phases).map((s) => ({
    x: 0.5 * W + s.x * R,
    y: 0.5 * H + s.y * R,
    vx: 0,
    vy: 0,
  }));

  let peakLag = 0;
  let throwEcc = 0;
  let restEcc = 0;

  for (let frame = 0; frame < 260; frame++) {
    t += 0.004;
    const target = frame < 60 ? { x: 0.32, y: 0.5 } : { x: 0.7, y: 0.5 };
    x = approach(x, target.x, 0.08);
    y = approach(y, target.y, 0.08);
    const cx = x * W;
    const cy = y * H;

    const held = blobLobes(t, phases).map((shape, i) => {
      const lobe = trail[i];
      const stiffness = 0.14 * (1 - 0.13 * i);
      const nx = spring(lobe.x, lobe.vx, cx + shape.x * R, stiffness, 0.76);
      const ny = spring(lobe.y, lobe.vy, cy + shape.y * R, stiffness, 0.76);
      lobe.x = nx.position;
      lobe.vx = nx.velocity;
      lobe.y = ny.position;
      lobe.vy = ny.velocity;

      const offset = constrainLobe((lobe.x - cx) / R, (lobe.y - cy) / R);
      const moving = frame > 58 && frame < 140;
      if (moving) {
        peakLag = Math.max(peakLag, Math.hypot(offset.x - shape.x, offset.y - shape.y));
      }
      return { ...offset, r: shape.r };
    });

    // never allowed to come apart, not even mid-throw
    const spread = eccentricity(held);
    assert.ok(Number.isFinite(spread), `blob tore apart at frame ${frame}`);
    if (frame > 58 && frame < 140) throwEcc = Math.max(throwEcc, spread);
    if (frame > 220) restEcc = spread;
  }

  assert.ok(peakLag > 0.25, `lobes barely lag (${peakLag.toFixed(3)}R) — blob slides rigidly`);
  assert.ok(
    throwEcc > restEcc * 1.4,
    `blob doesn't stretch when moving: ${throwEcc.toFixed(2)} vs ${restEcc.toFixed(2)} at rest`,
  );
}

// ── the tether keeps the blob intact however hard it is thrown ──────────────
// The springs lag independently, so a fast cursor throw stretches lobes further
// than the shape function ever asks for. constrainLobe is what stops that
// tearing the blob into islands — but only if MAX_LOBE_REACH is compatible with
// the radii the shape actually produces, so derive those and check rather than
// trusting the constant.
{
  let minRing = Infinity;
  let maxRing = 0;
  let minCentre = Infinity;
  for (let seed = 0; seed < 8; seed++) {
    const phases = blobPhases(() => (seed * 0.618033 + 0.137) % 1);
    for (let t = 0; t < 60; t += 0.25) {
      const lobes = blobLobes(t, phases);
      minCentre = Math.min(minCentre, lobes[0].r);
      lobes.slice(1).forEach((l) => {
        minRing = Math.min(minRing, l.r);
        maxRing = Math.max(maxRing, l.r);
      });
    }
  }
  assert.ok(
    MAX_LOBE_REACH < 0.85 * (minRing + minCentre),
    `tether lets a lobe pull free: ${MAX_LOBE_REACH} vs ${(0.85 * (minRing + minCentre)).toFixed(3)}`,
  );
  assert.ok(
    MAX_LOBE_REACH + maxRing <= 1,
    `a fully stretched lobe escapes the spotlight radius: ${MAX_LOBE_REACH + maxRing}`,
  );

  // direction preserved, magnitude capped, short offsets untouched
  const long = constrainLobe(3, 4);
  assert.ok(Math.abs(Math.hypot(long.x, long.y) - MAX_LOBE_REACH) < 1e-9, "capped to the tether");
  assert.ok(Math.abs(long.x / long.y - 3 / 4) < 1e-9, "direction preserved when capped");
  assert.deepEqual(constrainLobe(0.1, 0.1), { x: 0.1, y: 0.1 }, "short offsets pass through");
  assert.deepEqual(constrainLobe(0, 0), { x: 0, y: 0 }, "a centred lobe is left alone");
}

// ── easing converges, monotonically, without overshoot ───────────────────────
let v = 0;
let previous = -1;
for (let i = 0; i < 200; i++) {
  v = approach(v, 1, 0.08);
  assert.ok(v > previous, "easing must always advance toward the target");
  assert.ok(v <= 1, `easing overshot the target: ${v}`);
  previous = v;
}
assert.ok(v > 0.99, `easing should be effectively there after 200 frames, got ${v}`);

// a target behind the current position pulls it back the other way
assert.ok(approach(1, 0, 0.08) < 1, "easing must work in both directions");

console.log("spotlight maths ok");
