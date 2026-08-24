// Run: node app/page/spiral.check.ts
import assert from "node:assert/strict";
import { GAP, RX, point, span, webPath } from "./spiral.ts";

const COUNT = 16;
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

// ── nothing is drawn before the first logo enters ────────────────────────────
assert.equal(webPath(0, COUNT), "", "no silk before anything has entered");

// ── the silk starts and ends exactly where the outer and inner logos sit ─────
for (const spiral of [0.05, 0.3, 0.62, 1]) {
  const { inner, outer } = span(spiral, COUNT);
  const p = points(webPath(spiral, COUNT));
  const [sx, sy] = point(outer);
  const [ex, ey] = point(inner);
  assert.ok(near(p[0][0], sx) && near(p[0][1], sy), `silk starts on the newest logo (${spiral})`);
  const tail = p[p.length - 1];
  assert.ok(near(tail[0], ex) && near(tail[1], ey), `silk ends on the first logo (${spiral})`);
}

// at full scroll the ends are the first and last logo's own spots
const full = points(webPath(1, COUNT));
assert.deepEqual(full[full.length - 1].map(Math.round), [50, 50], "silk winds into the centre");
assert.ok(
  near(full[0][0], point(1 - (COUNT - 1) * GAP)[0]),
  "silk's outer end is logo 16, not the bare tail",
);

console.log("spiral.check.ts: all good");
