// Run: node app/page/spiral.check.ts
import assert from "node:assert/strict";
import {
  DECOR, ENTRY, GAP, RX, START_GAP, decorPath, decorPoint, point, span, webPath,
} from "./spiral.ts";

const COUNT = 16;
// The coil is parked against the right of the pane, so a stroke is clear of the
// frame once it is this far past the canvas box. Anything less and it would
// pop into being on screen.
const OFF_FRAME = 112;
const near = (a: number, b: number, eps = 0.02) => Math.abs(a - b) < eps;
const radius = ([x, y]: [number, number]) => Math.hypot((x - 50) / RX, (y - 50) / 30);
const points = (d: string) =>
  [...d.matchAll(/([ML])([-\d.]+) ([-\d.]+)/g)].map((m) => [+m[2], +m[3]] as [number, number]);

// ── the path matches the sketch: right-hand tail, spiralling in to the centre ─
assert.deepEqual(point(0), [50 + RX, 50], "t=0 is the outer tail on the right");
assert.deepEqual(point(1).map(Math.round), [50, 50], "t=1 is the dead centre");
let last = Infinity;
for (let t = 0; t <= 1; t += 0.005) {
  const r = radius(point(t));
  assert.ok(r < last + 1e-9, `radius must only shrink, grew at t=${t}`);
  last = r;
}
assert.ok(point(0.1)[1] < 50, "leaving the tail it climbs, i.e. counter-clockwise");

// ── nothing is drawn before the first logo has cleared the start gap ─────────
assert.equal(webPath(0, COUNT), "", "no silk before anything has entered");
assert.equal(webPath(START_GAP, COUNT), "", "no silk while the gap is all there is");
assert.ok(webPath(START_GAP * 3, COUNT) !== "", "silk appears once past the gap");

// ── the silk stops short of the newest logo and ends on the first one ────────
assert.ok(START_GAP > 0 && START_GAP < GAP, "the gap is a fraction of one logo step");
for (const spiral of [0.05, 0.3, 0.62, 1]) {
  const { inner, outer } = span(spiral, COUNT);
  const p = points(webPath(spiral, COUNT));
  const [sx, sy] = point(outer + START_GAP);
  const [ex, ey] = point(inner);
  assert.ok(near(p[0][0], sx) && near(p[0][1], sy), `silk starts past the gap (${spiral})`);
  const [nx, ny] = point(outer);
  // Wide enough to clear the logo art itself, not just the stroke's own cap.
  assert.ok(Math.hypot(p[0][0] - nx, p[0][1] - ny) > 8, `a visible space before it (${spiral})`);
  const tail = p[p.length - 1];
  assert.ok(near(tail[0], ex) && near(tail[1], ey), `silk ends on the first logo (${spiral})`);
}

// at full scroll the inner end is the centre and the outer end clears logo 16
const full = points(webPath(1, COUNT));
assert.deepEqual(full[full.length - 1].map(Math.round), [50, 50], "silk winds into the centre");
assert.ok(
  near(full[0][0], point(1 - (COUNT - 1) * GAP + START_GAP)[0]),
  "silk's outer end is one gap inside logo 16, not the bare tail",
);

// ── the two decorative strokes ───────────────────────────────────────────────
assert.equal(DECOR.length, 2, "two companion lines, no more");
assert.ok(ENTRY < 0, "the run-in happens before the coil's own t");

for (const [i, d] of DECOR.entries()) {
  const label = `decor ${i}`;

  // It begins off the right-hand edge, never in open canvas.
  const [ex, ey] = decorPoint(ENTRY, d);
  assert.ok(ex > OFF_FRAME, `${label}: starts off the right edge (was x=${ex.toFixed(1)})`);
  assert.ok(ey > -20 && ey < 120, `${label}: enters level, not from far above or below`);
  assert.ok(Math.cos(d.entry) > 0, `${label}: the entry angle points at the right-hand edge`);

  // ...and the very first thing ever drawn is that off-frame point, so the
  // stroke slides in rather than appearing mid-canvas.
  const born = points(decorPath(d.lead + 0.02, d));
  assert.ok(born.length > 0, `${label}: something is drawn just after its lead`);
  assert.ok(born[0][0] > OFF_FRAME, `${label}: born off-frame (was x=${born[0][0].toFixed(1)})`);

  // The run-in hands over to the coil without a jump.
  const [bx, by] = decorPoint(-1e-6, d);
  const [ax, ay] = decorPoint(0, d);
  assert.ok(near(bx, ax, 0.01) && near(by, ay, 0.01), `${label}: run-in meets the coil cleanly`);

  // They hold back, then draw themselves in as the scroll runs.
  assert.equal(decorPath(0, d), "", `${label}: nothing before the coil starts`);
  assert.equal(decorPath(d.lead, d), "", `${label}: nothing until its own lead is spent`);
  assert.ok(decorPath(1, d) !== "", `${label}: drawn by the end of the section`);

  // Abstract, not a clean orbit: the radius has to come back out again, which
  // is the whole difference between a doodle and a second spiral.
  let grew = false;
  let prev = radius(decorPoint(0, d));
  for (let t = 0.002; t <= 1; t += 0.002) {
    const r = radius(decorPoint(t, d));
    if (r > prev + 1e-6) grew = true;
    prev = r;
  }
  assert.ok(grew, `${label}: must wander back outward somewhere`);

  // Once it is in, it stays on the canvas — overflow is visible, but the coil
  // proper should not wander back out of frame.
  for (let t = 0; t <= 1; t += 0.005) {
    const [x, y] = decorPoint(t, d);
    assert.ok(x > -20 && x < 105 && y > -20 && y < 120, `${label}: the coil stays in frame`);
  }

  // The head chases the scroll and the tail follows it, so the stroke sweeps
  // rather than growing from a fixed anchor.
  const late = points(decorPath(1, d));
  const mid = points(decorPath(0.6, d));
  assert.ok(
    radius(late[late.length - 1]) < radius(mid[mid.length - 1]),
    `${label}: its head keeps moving inward`,
  );
}

// the decorative strokes never sync with the coil's own rhythm
for (const d of DECOR) {
  assert.notEqual(d.turns, 2.4, "a decor line matching TURNS would look like a copy");
}

console.log("spiral.check.ts: all good");
