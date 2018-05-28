<template>
  <div class="game-wrap">
    <div class="score-wrap">
      <div class="score-label">Score</div>
      <div class="score-text" v-html="score"></div>
    </div>
    <button
      v-if="!ballOption"
      class="start-btn"
      @click="start">
      Start
    </button>
    <Ball
      v-if="ballOption && !isDead"
      :option="ballOption"
      @completed="handleBallCompleted"/>
    <div v-if="this.isDead" class="result-wrap">
      <button class="restart-btn" @click="start">Restart</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { BallOption, Level } from '@/types'
import { randomWithRange } from '@/util'
import Ball from './Ball.vue'

@Component({
  components: {
    Ball,
  },
})
export default class Game extends Vue {
  public ballOption: BallOption | null = null
  public score: number = 0
  public initLevel: Level = {
    duration: 1,
    pointDuration: 1.5,
  }
  public isDead: boolean = false

  get levelNumber(): number {
    return this.score / 10
  }

  get level(): Level {
    let { duration, pointDuration } = Object.assign({}, this.initLevel)
    duration -= this.levelNumber * 0.2
    pointDuration -= this.levelNumber * 0.2
    return {
      duration,
      pointDuration,
    }
  }

  public start() {
    console.log('Start')
    this.isDead = false
    this.score = 0
    this.setRandomBallWithLevel()
  }

  public setRandomBall(duration: number = 1, pointDuration: number = 1.5) {
    const position = {
      x: randomWithRange(10, 90),
      y: randomWithRange(10, 90),
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
    const { duration, pointDuration } = this.level
    this.setRandomBall(duration, pointDuration)
  }

  public handleBallCompleted(isScored: boolean) {
    if (isScored) {
      this.score ++
      this.setRandomBallWithLevel()
    } else {
      this.isDead = true
    }
  }

  // @Watch('score')
  // private onScoreChanged(score: number) {
  // }

}
</script>
<style lang="sass">
  @import './style.sass'
</style>

