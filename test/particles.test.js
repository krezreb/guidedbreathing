import { describe, expect, it } from 'vitest'

import { makeParticles, stepParticles } from '../src/services/particles.js'
import { PHASE } from '../src/services/sessionController.js'

/** Deterministic stand-in for Math.random, so positions are predictable. */
const half = () => 0.5

/** Advance one particle in small steps, the way the draw loop does. */
function run(particle, phase, seconds, step = 1 / 60) {
  for (let elapsed = 0; elapsed < seconds; elapsed += step) {
    stepParticles([particle], phase, step)
  }
  return particle
}

describe('background particles', () => {
  it('places every particle inside the canvas', () => {
    const particles = makeParticles(20)
    for (const particle of particles) {
      expect(particle.x).toBeGreaterThanOrEqual(0)
      expect(particle.x).toBeLessThanOrEqual(1)
      expect(particle.y).toBeGreaterThanOrEqual(0)
      expect(particle.y).toBeLessThanOrEqual(1)
    }
  })

  it('rises on inhale and falls more slowly on exhale', () => {
    const risen = run(makeParticles(1, half)[0], PHASE.INHALE, 4)
    const fallen = run(makeParticles(1, half)[0], PHASE.EXHALE, 4)

    expect(risen.y).toBeLessThan(0.5)
    expect(fallen.y).toBeGreaterThan(0.5)
    expect(fallen.y - 0.5).toBeLessThan(0.5 - risen.y)
  })

  it('settles at a terminal speed rather than accelerating forever', () => {
    const brief = run(makeParticles(1, half)[0], PHASE.EXHALE, 2).velocity
    const long = run(makeParticles(1, half)[0], PHASE.EXHALE, 20).velocity
    expect(long).toBeCloseTo(brief, 6)
  })

  it('keeps rising for a moment after the exhale starts, then reverses', () => {
    const particle = run(makeParticles(1, half)[0], PHASE.INHALE, 4)
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
    const particle = { x: 0.5, y: 0.02, speed: 1, velocity: 0 }
    run(particle, PHASE.INHALE, 10)
    expect(particle.y).toBeGreaterThan(0)
    expect(particle.y).toBeLessThan(1)
  })

  it('is frame-rate independent', () => {
    const coarse = run(makeParticles(1, half)[0], PHASE.INHALE, 3, 1 / 30).y
    const fine = run(makeParticles(1, half)[0], PHASE.INHALE, 3, 1 / 120).y
    expect(fine).toBeCloseTo(coarse, 2)
  })
})
