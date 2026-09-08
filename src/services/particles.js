/**
 * The background particle field (TECH_SPECS §4.1).
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
 *
 * Each particle also fades in as it appears and out as it dies, then respawns
 * elsewhere with fresh randomised motion. Nothing pops.
 *
 * Stepping the field with the `SETTLE` phase instead of a breath phase lets it
 * run down: everything falls, nothing wraps and nothing respawns, so the field
 * empties out. The completion screen uses this to let the session's own
 * particles fall away rather than cutting to a still image.
 *
 * Every range this module draws from lives in `data/particleField.js`.
 */
import { PARTICLE_FIELD } from '../data/particleField.js'
import { PHASE } from './sessionController.js'

/**
 * Stands in for a phase once the breathing has stopped: the field falls off the
 * bottom of the canvas and is not replenished.
 */
export const SETTLE = 'SETTLE'

/** A value from a `[min, max]` config range. */
function pick([min, max], rand) {
  return min + rand() * (max - min)
}

/**
 * Randomise everything about a particle except where it is: respawning reuses
 * this, and a particle that fades out mid-canvas should not also jump.
 */
function reseed(particle, rand, config) {
  particle.radius = pick(config.radius, rand)
  particle.alpha = pick(config.alpha, rand)
  particle.mass = pick(config.mass, rand)
  particle.velocity = pick(config.velocity, rand)
  reseedDrift(particle, rand, config)
  particle.lifeSeconds = pick(config.lifeSeconds, rand)
  particle.age = 0
  return particle
}

/**
 * Sideways travel per unit of vertical travel, so the tilt holds whatever the
 * particle's speed is and reverses with it on the way back down. Redrawn each
 * inhale: a fixed angle would have every breath retrace the same lines.
 */
function reseedDrift(particle, rand, config) {
  particle.drift = Math.tan((pick(config.driftDegrees, rand) * Math.PI) / 180)
}

export function makeParticles(count = PARTICLE_FIELD.count, rand = Math.random, config = PARTICLE_FIELD) {
  return Array.from({ length: count }, () => {
    const particle = reseed({ x: rand(), y: rand() }, rand, config)
    // Start each particle part-way through its life, or the whole field would
    // fade in together on the first frame and die together later.
    particle.age = rand() * particle.lifeSeconds
    return particle
  })
}

/**
 * Fade in over the first sixth of a life and out over the last, holding full
 * opacity in between: a sine envelope would leave a particle at peak opacity
 * for only an instant, which reads as a pulse rather than a drift.
 */
function envelope(fraction) {
  const edge = 1 / 6
  if (fraction < edge) return fraction / edge
  // Clamped at zero: a settling particle is never respawned, so its age runs
  // past its life instead of resetting.
  if (fraction > 1 - edge) return Math.max(0, (1 - fraction) / edge)
  return 1
}

/**
 * Advance the field in place by dtSeconds, setting each particle's current
 * `opacity`. Particles that leave one edge re-enter at the other, so the field
 * never empties out during a long session.
 */
/**
 * The one field, shared by every canvas that draws it, so a particle keeps its
 * position and momentum when the screen it was drawn on goes away.
 */
export const field = makeParticles()

export function stepParticles(particles, phase, dtSeconds, rand = Math.random, config = PARTICLE_FIELD) {
  const inhaling = phase === PHASE.INHALE
  const settling = phase === SETTLE
  const acceleration = inhaling ? -config.lift : config.gravity

  for (const particle of particles) {
    if (inhaling && !particle.rising) reseedDrift(particle, rand, config)
    particle.rising = inhaling

    const limit = (inhaling ? config.riseLimit : config.fallLimit) * particle.mass
    // A particle carries velocity across the phase change, so this clamp only
    // bites once it is travelling the way the current phase pulls.
    const velocity = particle.velocity + acceleration * particle.mass * dtSeconds
    particle.velocity = inhaling ? Math.max(velocity, -limit) : Math.min(velocity, limit)

    particle.y += particle.velocity * dtSeconds
    if (!settling) {
      if (particle.y < 0) particle.y += 1
      else if (particle.y > 1) particle.y -= 1
    }

    particle.x += particle.velocity * particle.drift * dtSeconds
    if (particle.x < 0) particle.x += 1
    else if (particle.x > 1) particle.x -= 1

    particle.age += dtSeconds
    if (!settling && particle.age >= particle.lifeSeconds) {
      // Fully faded out by now, so moving it is invisible.
      particle.x = rand()
      particle.y = rand()
      reseed(particle, rand, config)
    }

    particle.opacity = particle.alpha * envelope(particle.age / particle.lifeSeconds)
  }
  return particles
}
