import { randomWithRange } from '@/util'

describe('Random number', () => {
  it('Random number in the range', () => {
    const min = 0,
          max = 100
    const rand = randomWithRange(min, max)
    expect(rand).toBeGreaterThanOrEqual(min)
    expect(rand).toBeLessThanOrEqual(max)
  })
})
