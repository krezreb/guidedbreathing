/** A clock that only moves when a test tells it to (TECH_SPECS §28.1). */
export function fakeClock(start = 0) {
  let t = start
  return {
    now: () => t,
    advance(ms) {
      t += ms
      return t
    },
  }
}
