<template>
  <div class="game-wrap">
    <div class="score-wrap">
      <div class="score-label">Score</div>
      <div class="score-text" v-html="score"></div>
    </div>
    <button
      v-if="!ballOption"
      class="start-btn"
      @click="setRandomBallWithLevel">Start
    </button>
    <Ball
      v-if="ballOption"
      :option="ballOption"
      @completed="handleBallCompleted"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { BallOption } from '@/types'
import { EASY, HARD } from '@/constants/level'
import levelConfig from './levelConfig'
import Ball from './Ball.vue'

@Component({
  components: {
    Ball,
  },
})
export default class Game extends Vue {
  public ballOption: BallOption | null = null
  public mainTimer: any = null
  public score: number = 0
  public level: string = EASY

  public init() {
    console.log('init')
  }

  public randomWithRange(min: number, max: number) {
    if (min < 0) { min = 0 }
    if (max > 100) { max = 100 }
    return Math.floor(Math.random() * (max - min) + min)
  }

  public setRandomBall(duration: number = 1, pointDuration: number = 1.5) {
    const position = {
      x: this.randomWithRange(10, 90),
      y: this.randomWithRange(10, 90),
    }
    this.ballOption = {
      startTS: new Date().getTime(),
      sx: 50,
      sy: 70,
      x: position.x,
      y: position.y,
      sSize: 0.3,
      size: 1,
      duration,
      pointDuration,
    }
  }

  public setRandomBallWithLevel() {
    const config = levelConfig[this.level]
    const { duration, pointDuration } = config
    this.setRandomBall(duration, pointDuration)
  }

  public handleBallCompleted(isScored: boolean) {
    if (isScored) { this.score ++ }
    this.setRandomBallWithLevel()
  }

  private mounted() {
    this.init()
  }

  @Watch('score')
  private onScoreChanged(score: number) {
    if (score > 3) { this.level = HARD }
  }

}
</script>
<style lang="sass">
  @import './style.sass'
</style>

