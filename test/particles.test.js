import { describe, expect, it } from 'vitest'

import { PARTICLE_FIELD } from '../src/data/particleField.js'
import { makeParticles, SETTLE, stepParticles } from '../src/services/particles.js'
import { PHASE } from '../src/services/sessionController.js'

/** Deterministic stand-in for Math.random, so particles are predictable. */
const half = () => 0.5

/** One particle, mid-range in every respect. */
function one(config = PARTICLE_FIELD, rand = half) {
  return makeParticles(1, rand, config)[0]
}

/** Advance one particle in small steps, the way the draw loop does. */
function run(particle, phase, seconds, step = 1 / 60, rand = half) {
  for (let elapsed = 0; elapsed < seconds; elapsed += step) {
    stepParticles([particle], phase, step, rand)
  }
  return particle
}

describe('background particles', () => {
  it('rises within 10 degrees of vertical', () => {
    for (const fraction of [0, 0.25, 0.5, 0.75, 1]) {
      const rand = () => fraction
      // Long-lived and mid-canvas, so it rises for the whole run without
      // respawning or wrapping round an edge.
      const particle = one({ ...PARTICLE_FIELD, lifeSeconds: [999, 999] }, rand)
      particle.x = 0.5
      particle.y = 0.5
      particle.age = 0
      const start = { ...particle }
      run(particle, PHASE.INHALE, 3, 1 / 60, rand)
      const rise = start.y - particle.y
      expect(rise).toBeGreaterThan(0)
      const degrees = Math.abs((Math.atan2(particle.x - start.x, rise) * 180) / Math.PI)
      expect(degrees).toBeLessThanOrEqual(10.0001)
    }
  })

  it('picks a fresh drift angle at the start of each inhale', () => {
    const particle = one()
    const angles = new Set()
    for (let breath = 0; breath < 6; breath++) {
      stepParticles([particle], PHASE.INHALE, 1 / 60)
      angles.add(particle.drift)
      // Exhaling is what arms the next redraw.
      stepParticles([particle], PHASE.EXHALE, 1 / 60)
      const held = particle.drift
      stepParticles([particle], PHASE.EXHALE, 1 / 60)
      expect(particle.drift).toBe(held)
    }
    expect(angles.size).toBeGreaterThan(1)
  })

  it('settles off the bottom of the canvas without respawning', () => {
    const particles = makeParticles(12)
    const start = particles.map((particle) => ({ ...particle }))

    for (let frame = 0; frame < 60 * 120; frame++) {
      stepParticles(particles, SETTLE, 1 / 60)
    }

    particles.forEach((particle, index) => {
      expect(particle.y).toBeGreaterThan(1)
      expect(particle.opacity).toBe(0)
      // Same particle throughout: settling never hands out a fresh one.
      expect(particle.radius).toBe(start[index].radius)
      expect(particle.lifeSeconds).toBe(start[index].lifeSeconds)
    })
  })

  it('places every particle inside the canvas', () => {
    for (const particle of makeParticles()) {
      expect(particle.x).toBeGreaterThanOrEqual(0)
      expect(particle.x).toBeLessThanOrEqual(1)
      expect(particle.y).toBeGreaterThanOrEqual(0)
      expect(particle.y).toBeLessThanOrEqual(1)
    }
  })

  it('rises on inhale and falls more slowly on exhale', () => {
    const risen = run(one(), PHASE.INHALE, 4)
    const fallen = run(one(), PHASE.EXHALE, 4)

    expect(risen.y).toBeLessThan(0.5)
    expect(fallen.y).toBeGreaterThan(0.5)
    expect(fallen.y - 0.5).toBeLessThan(0.5 - risen.y)
  })

  it('settles at a terminal speed rather than accelerating forever', () => {
    const brief = run(one(), PHASE.EXHALE, 2).velocity
    const long = run(one(), PHASE.EXHALE, 6).velocity
    expect(long).toBeCloseTo(brief, 6)
  })

  it('keeps rising for a moment after the exhale starts, then reverses', () => {
    const particle = run(one(), PHASE.INHALE, 4)
    const turned = particle.y

    // Still travelling up: gravity has to cancel the momentum first.
    run(particle, PHASE.EXHALE, 0.5)
    expect(particle.velocity).toBeLessThan(0)
    expect(particle.y).toBeLessThan(turned)

    const stalled = particle.y
    run(particle, PHASE.EXHALE, 4)
    expect(particle.velocity).toBeGreaterThan(0)
    expect(particle.y).toBeGreaterThan(stalled)
  })

  it('wraps around rather than drifting off the canvas', () => {
    const particle = one()
    particle.y = 0.02
    run(particle, PHASE.INHALE, 10)
    expect(particle.y).toBeGreaterThan(0)
    expect(particle.y).toBeLessThan(1)
  })

  it('is frame-rate independent', () => {
    const coarse = run(one(), PHASE.INHALE, 3, 1 / 30).y
    const fine = run(one(), PHASE.INHALE, 3, 1 / 120).y
    expect(fine).toBeCloseTo(coarse, 2)
  })

  it('fades in from nothing, holds, then fades back out', () => {
    const particle = one()
    particle.age = 0
    stepParticles([particle], PHASE.INHALE, 0.001, half)
    const appearing = particle.opacity

    run(particle, PHASE.INHALE, particle.lifeSeconds / 2)
    const held = particle.opacity

    expect(appearing).toBeLessThan(held * 0.1)
    expect(held).toBeCloseTo(particle.alpha, 6)
  })

  it('never draws a particle at more than its peak opacity', () => {
    const particles = makeParticles()
    for (let frame = 0; frame < 600; frame += 1) {
      stepParticles(particles, frame % 2 ? PHASE.INHALE : PHASE.EXHALE, 1 / 60)
      for (const particle of particles) {
        expect(particle.opacity).toBeGreaterThanOrEqual(0)
        expect(particle.opacity).toBeLessThanOrEqual(particle.alpha)
      }
    }
  })

  it('respawns a dead particle elsewhere with fresh motion', () => {
    const particle = one()
    particle.age = particle.lifeSeconds
    particle.x = 0.123
    stepParticles([particle], PHASE.INHALE, 1 / 60, () => 0.75)

    expect(particle.age).toBeLessThan(1)
    expect(particle.x).toBe(0.75)
    // Redrawn from the 75% point of every range rather than the 50% one.
    expect(particle.mass).toBeCloseTo(0.5 + 0.75 * 1.1, 6)
  })

  it('draws every randomised quantity from the config ranges', () => {
    const config = { ...PARTICLE_FIELD, mass: [3, 3], lifeSeconds: [5, 5], alpha: [7, 7] }
    for (const particle of makeParticles(10, Math.random, config)) {
      expect(particle.mass).toBe(3)
      expect(particle.lifeSeconds).toBe(5)
      expect(particle.alpha).toBe(7)
    }
  })

  it('honours the configured particle count', () => {
    expect(makeParticles()).toHaveLength(PARTICLE_FIELD.count)
  })
})
