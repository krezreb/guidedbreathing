/**
 * Tuning for the background particle field (TECH_SPECS §4.1).
 *
 * Every randomised quantity is a `[min, max]` range, so the field's character
 * can be retuned here without touching the physics in
 * `services/particles.js` or the draw loop in `BreathingCanvas.vue`.
 *
 * Distances are unit fractions of the canvas height per second, or per second
 * squared for the accelerations, so the field looks the same on any screen.
 */
export const PARTICLE_FIELD = {
  count: 28,

  /** Radius in unit terms, scaled to pixels at draw time. */
  radius: [0.002, 0.006],

  /** Peak opacity, 0–255. Low: this sits behind the bubble. */
  alpha: [10, 36],

  /**
   * Stands in for mass. Scales both the acceleration a particle feels and the
   * speed it settles at, so the field never moves as one sheet and the heavier
   * particles visibly lag the breath. Below 1 is heavier than nominal.
   */
  mass: [0.5, 1.6],

  /**
   * Momentum a particle already carries when it appears, so a fresh particle
   * joins a field that is already in motion instead of starting dead still.
   * Negative is upward.
   */
  velocity: [-0.02, 0.02],

  /**
   * How long a particle lives before it fades out and is replaced somewhere
   * else. Spread widely so the field never blinks in unison.
   */
  lifeSeconds: [7, 18],

  /** How hard each phase pulls. Gravity is the weaker of the two, so the stall
   *  at the top of the breath is unhurried. */
  lift: 0.09,
  gravity: 0.035,

  /** Terminal speeds. Falling is gentler than rising: the field settles, it
   *  does not drop. */
  riseLimit: 0.07,
  fallLimit: 0.028,
}
