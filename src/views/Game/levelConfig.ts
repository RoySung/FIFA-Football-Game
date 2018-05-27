import { EASY, HARD } from '@/constants/level'

import { Levels } from '@/types'

const levels: Levels = {
  [EASY]: {
    duration: 1,
    pointDuration: 1.5,
  },
  [HARD]: {
    duration: 0.8,
    pointDuration: 0.8,
  },
}

export default levels
