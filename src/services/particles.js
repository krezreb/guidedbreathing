/**
 * The background particle field (TECH_SPECS §4).
 *
 * Pure geometry, no p5: positions are unit fractions of the canvas (x 0 = left,
 * y 0 = top) so a resize needs no rescaling, and the drift is driven by elapsed
 * seconds rather than frames so it cannot speed up on a faster display.
 *
 * Particles rise while the breath comes in and settle back down more slowly
 * while it goes out, which is what makes the field read as breath rather than
 * as weather.
 *
 * They carry momentum: the phase sets an acceleration, not a speed, so a
 * particle still travelling up when the exhale starts decelerates, stalls and
 * only then begins to fall. Reversing the velocity outright reads as weightless
 * confetti; letting it decay reads as something with mass.
 */
import { PHASE } from './sessionController.js'

/** Unit heights per second squared: how hard each phase pulls. Gravity is the
 *  weaker of the two, so the stall at the top of the breath is unhurried. */
const LIFT = 0.09
const GRAVITY = 0.035

/** Terminal speeds in unit heights per second. Falling is gentler than rising:
 *  the field settles, it does not drop. */
const RISE_LIMIT = 0.07
const FALL_LIMIT = 0.028

export function makeParticles(count, rand = Math.random) {
  return Array.from({ length: count }, () => ({
    x: rand(),
    y: rand(),
    // Radius in unit terms; scaled to pixels at draw time.
    radius: 0.002 + rand() * 0.004,
    alpha: 10 + rand() * 26,
    // Stands in for mass: it scales both the acceleration a particle feels and
    // the speed it settles at, so the field never moves as one sheet. Heavier
    // particles (a low factor) lag the breath by more.
    speed: 0.6 + rand() * 0.8,
    // Negative is upward, matching the y axis.
    velocity: 0,
  }))
}

/**
 * Advance the field in place by dtSeconds. Particles that leave one edge
 * re-enter at the other, so the field never empties out during a long session.
 */
export function stepParticles(particles, phase, dtSeconds) {
  const inhaling = phase === PHASE.INHALE
  const acceleration = inhaling ? -LIFT : GRAVITY

  for (const particle of particles) {
    const limit = (inhaling ? RISE_LIMIT : FALL_LIMIT) * particle.speed
    // A particle carries velocity across the phase change, so this clamp only
    // bites once it is travelling the way the current phase pulls.
    const velocity = (particle.velocity ?? 0) + acceleration * particle.speed * dtSeconds
    particle.velocity = inhaling ? Math.max(velocity, -limit) : Math.min(velocity, limit)

    particle.y += particle.velocity * dtSeconds
    if (particle.y < 0) particle.y += 1
    else if (particle.y > 1) particle.y -= 1
  }
  return particles
}
