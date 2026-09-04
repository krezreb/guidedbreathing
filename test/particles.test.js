import { describe, expect, it } from 'vitest'

import { makeParticles, stepParticles } from '../src/services/particles.js'
import { PHASE } from '../src/services/sessionController.js'

/** Deterministic stand-in for Math.random, so positions are predictable. */
const half = () => 0.5

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
    const [risen] = stepParticles(makeParticles(1, half), PHASE.INHALE, 1)
    const [fallen] = stepParticles(makeParticles(1, half), PHASE.EXHALE, 1)

    expect(risen.y).toBeLessThan(0.5)
    expect(fallen.y).toBeGreaterThan(0.5)
    expect(fallen.y - 0.5).toBeLessThan(0.5 - risen.y)
  })

  it('wraps around rather than drifting off the canvas', () => {
    const particles = [{ x: 0.5, y: 0.02, speed: 1 }]
    stepParticles(particles, PHASE.INHALE, 10)
    expect(particles[0].y).toBeGreaterThan(0)
    expect(particles[0].y).toBeLessThan(1)
  })

  it('is frame-rate independent', () => {
    const oneStep = stepParticles(makeParticles(1, half), PHASE.INHALE, 0.5)[0].y
    const twoSteps = makeParticles(1, half)
    stepParticles(twoSteps, PHASE.INHALE, 0.25)
    stepParticles(twoSteps, PHASE.INHALE, 0.25)
    expect(twoSteps[0].y).toBeCloseTo(oneStep, 10)
  })
})
