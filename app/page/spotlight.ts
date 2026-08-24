// Pure maths behind the hero spotlight. Kept out of heroPage.tsx so it can be
// exercised without a browser — see spotlight.check.ts.

/** The slice of the image box the figure actually fills. Both photos are
 *  transparent outside roughly this rectangle, so a spotlight centred out there
 *  reveals nothing — it just looks like the hole slid off the picture. */
export const FIGURE = { minX: 0.3, maxX: 0.72, minY: 0.18, maxY: 0.78 };

/** Keep a target on the figure. Applied to the cursor so hovering the empty
 *  corners of the box nudges the spotlight to the nearest edge of the person
 *  instead of dragging it out into the transparent margin. */
export function clampToFigure(p: { x: number; y: number }) {
  return {
    x: Math.min(Math.max(p.x, FIGURE.minX), FIGURE.maxX),
    y: Math.min(Math.max(p.y, FIGURE.minY), FIGURE.maxY),
  };
}

/** Idle path: a slow Lissajous kept over the head and chest, so the reveal
 *  always lands on something worth seeing rather than empty shoulder. */
export function driftTarget(t: number) {
  return { x: 0.5 + 0.16 * Math.sin(t), y: 0.42 + 0.18 * Math.sin(t * 1.3 + 0.7) };
}

/** Lobe count: one in the middle, the rest on a ring around it. Their union is
 *  the blob. More lobes means a smoother outline and more mask layers to
 *  rasterise every frame. */
export const BLOB_LOBES = 5;

/**
 * Base angles for the ring lobes, deliberately uneven.
 *
 * Evenly spaced lobes of similar size make a regular polygon, and a soft edge
 * rounds a regular polygon straight back into a disc — which is exactly how an
 * earlier version of this ended up a perfect circle. The irregular spacing is
 * load-bearing, not decoration.
 */
const BASE_ANGLES = [0, 1.9, 3.35, 4.9];

/** A phase offset per lobe, drawn once per mount so no two visits start from
 *  the same blob. Takes the generator so the check can pin it down. */
export function blobPhases(random: () => number = Math.random) {
  return Array.from({ length: BLOB_LOBES }, () => random() * Math.PI * 2);
}

/**
 * The blob, as a set of overlapping circles — position and radius both given as
 * multiples of the spotlight radius.
 *
 * Every lobe breathes on its own period, and the periods are deliberately not
 * whole-number multiples of each other, so the sum never comes back around to a
 * shape it has held before. That is what "always changing" needs: not
 * randomness per frame, which would jitter, but a cycle too long to perceive.
 */
export function blobLobes(t: number, phases: number[]) {
  return Array.from({ length: BLOB_LOBES }, (_, i) => {
    if (i === 0) {
      return { x: 0, y: 0, r: 0.44 + 0.04 * Math.sin(t * 1.7 + phases[0]) };
    }
    const ring = i - 1;

    // Every ring lobe must ALWAYS poke out past the centre: the closest a lobe
    // can sit plus its smallest radius still clears the centre's largest radius.
    // Let a lobe get swallowed and the union collapses to the centre circle on
    // its own, which is a literal perfect circle — the exact bug this shape had.
    // The check pins this down; don't widen these ranges without rerunning it.
    const angle = BASE_ANGLES[ring] + 0.55 * Math.sin(t * (0.8 + 0.17 * ring) + phases[i]);
    const distance = 0.39 + 0.13 * Math.sin(t * (1.1 + 0.31 * ring) + phases[i] * 1.7);

    return {
      x: distance * Math.cos(angle),
      y: distance * Math.sin(angle),
      // Per-lobe frequencies, so the four bumps don't swell in unison and
      // average back out into something round.
      r: 0.38 + 0.06 * Math.sin(t * (1.9 + 0.27 * ring) + phases[i] * 2.3),
    };
  });
}

/**
 * How far the union reaches along a ray from the centre at `theta`.
 *
 * Exists so the shape can be measured rather than eyeballed — max/min of this
 * over a full turn is the eccentricity, where 1.0 means a perfect circle.
 */
export function outlineRadius(
  lobes: { x: number; y: number; r: number }[],
  theta: number,
) {
  const ux = Math.cos(theta);
  const uy = Math.sin(theta);
  let far = 0;
  for (const lobe of lobes) {
    const along = lobe.x * ux + lobe.y * uy;
    const disc = lobe.r * lobe.r - (lobe.x * lobe.x + lobe.y * lobe.y) + along * along;
    if (disc < 0) continue; // the ray misses this lobe entirely
    far = Math.max(far, along + Math.sqrt(disc));
  }
  return far;
}

/** Eccentricity of the blob: 1.0 is a circle, higher is lumpier. */
export function eccentricity(lobes: { x: number; y: number; r: number }[], samples = 128) {
  const radii = Array.from({ length: samples }, (_, i) =>
    outlineRadius(lobes, (i / samples) * Math.PI * 2),
  );
  return Math.max(...radii) / Math.min(...radii);
}

/** Shortest distance from a point to a rectangle; 0 when the point is inside.
 *  This is the "radar" test — how close the cursor has to get before it takes
 *  the spotlight over from the drift. */
export function rectDistance(
  x: number,
  y: number,
  box: { left: number; right: number; top: number; bottom: number },
) {
  const dx = Math.max(box.left - x, 0, x - box.right);
  const dy = Math.max(box.top - y, 0, y - box.bottom);
  return Math.hypot(dx, dy);
}

/** One frame of easing: close `ease` of the remaining gap. */
export function approach(current: number, target: number, ease: number) {
  return current + (target - current) * ease;
}

/**
 * One frame of a damped spring.
 *
 * Used instead of `approach` for the lobes because exponential easing never
 * overshoots — it decelerates into the target and stops dead, which is exactly
 * the stiffness we're trying to get rid of. A spring carries momentum past the
 * target and settles back, so the blob arrives with a wobble.
 */
export function spring(
  position: number,
  velocity: number,
  target: number,
  stiffness: number,
  damping: number,
) {
  const next = (velocity + (target - position) * stiffness) * damping;
  return { position: position + next, velocity: next };
}

/**
 * How far a lobe may sit from the blob's centre, in multiples of the spotlight
 * radius.
 *
 * `blobLobes` already keeps its own offsets inside this, but once each lobe
 * springs independently they lag by different amounts and a fast cursor throw
 * can stretch them further than the shape ever asks for. Without a tether the
 * blob tears into separate islands mid-flick. This is the guarantee that the
 * geometry invariants survive the fluid motion, not just the resting shape.
 */
export const MAX_LOBE_REACH = 0.55;

/** Pull a lobe offset back onto the tether, preserving its direction. */
export function constrainLobe(dx: number, dy: number) {
  const distance = Math.hypot(dx, dy);
  if (distance <= MAX_LOBE_REACH) return { x: dx, y: dy };
  const scale = MAX_LOBE_REACH / distance;
  return { x: dx * scale, y: dy * scale };
}
