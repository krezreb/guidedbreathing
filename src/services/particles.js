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
 * Every range this module draws from lives in `data/particleField.js`.
 */
import { PARTICLE_FIELD } from '../data/particleField.js'
import { PHASE } from './sessionController.js'

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
  particle.lifeSeconds = pick(config.lifeSeconds, rand)
  particle.age = 0
  return particle
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
  if (fraction > 1 - edge) return (1 - fraction) / edge
  return 1
}

/**
 * Advance the field in place by dtSeconds, setting each particle's current
 * `opacity`. Particles that leave one edge re-enter at the other, so the field
 * never empties out during a long session.
 */
export function stepParticles(particles, phase, dtSeconds, rand = Math.random, config = PARTICLE_FIELD) {
  const inhaling = phase === PHASE.INHALE
  const acceleration = inhaling ? -config.lift : config.gravity

  for (const particle of particles) {
    const limit = (inhaling ? config.riseLimit : config.fallLimit) * particle.mass
    // A particle carries velocity across the phase change, so this clamp only
    // bites once it is travelling the way the current phase pulls.
    const velocity = particle.velocity + acceleration * particle.mass * dtSeconds
    particle.velocity = inhaling ? Math.max(velocity, -limit) : Math.min(velocity, limit)

    particle.y += particle.velocity * dtSeconds
    if (particle.y < 0) particle.y += 1
    else if (particle.y > 1) particle.y -= 1

    particle.age += dtSeconds
    if (particle.age >= particle.lifeSeconds) {
      // Fully faded out by now, so moving it is invisible.
      particle.x = rand()
      particle.y = rand()
      reseed(particle, rand, config)
    }

    particle.opacity = particle.alpha * envelope(particle.age / particle.lifeSeconds)
  }
  return particles
}
