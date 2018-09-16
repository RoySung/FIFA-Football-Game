<template>
  <div class="game-wrap">
    <template v-if="!isRank">
      <div v-if="!ballOption || isDead" class="scoreboard">
        <div class="score-wrap">
          <div class="score-wrap__now-score">
            <div class="score-label">Now Score</div>
            <div class="score-text" v-html="twoDigit(score)"></div>
          </div>
          <div class="score-wrap__high-score">
            <div class="score-label">High Score</div>
            <div class="score-text" v-html="twoDigit(highestScore)"></div>
          </div>
        </div>
        <button
          class="menu-btn"
          @click="start"
          v-html="startText">
        </button>
        <button
          class="menu-btn"
          @click="isRank = true">
          Rank
        </button>
      </div>
      <Ball
        v-if="ballOption && !isDead"
        :option="ballOption"
        @completed="handleBallCompleted"/>
    </template>
    <div v-else class="rank-wrap">
      <div class="rank-wrap__board">
        <h1 class="rank-wrap__board__title">Rank</h1>
        <ul class="rank-list">
          <li class="rank-item" v-for="(scroeData, index) in rankArr" :key="`${scroeData.playerName}-${scroeData.score}-${index}`">
            <div class="rank-item__name" v-html="scroeData.playerName"></div>
            <div class="rank-item__name" v-html="scroeData.score"></div>
          </li>
        </ul>
        <button
          v-if="isRank"
          class="menu-btn rank-wrap__back-btn"
          @click="isRank = false">
          Back
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { BallOption, Level, ScoreData } from '@/types'
import { randomWithRange } from '@/util'
import Ball from './Ball.vue'
import { GameApi } from '@/api'
const standardRange: number = 5


@Component({
  components: {
    Ball,
  },
})
export default class Game extends Vue {
  public ballOption: BallOption | null = null
  public score: number = 0
  public highestScore: number = 0
  public initLevel: Level = {
    duration: 1,
    pointDuration: 1.5,
  }
  public isDead: boolean = false
  public isNewHScore: boolean = false
  public isRank: boolean = false
  public rankArr: ScoreData[] = []
  public gameData: GameApi = new GameApi()

  get levelNumber(): number {
    return this.score / standardRange
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

  get startText(): string {
    return this.isDead ? 'Restart' : 'Start'
  }

  public start() {
    this.isDead = false
    this.isNewHScore = false
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

  public setHighestScore(score: number) {
    this.highestScore = score
    window.localStorage.setItem('highestScore', score.toString())
    window.localStorage.setItem('timestamp', `${new Date().getTime()}`)
    this.gameData.setScore(score).then(res => console.log(res))
  }

  public getHighestScore(): number {
    const localScore = window.localStorage.getItem('highestScore')
    const score = localScore ? parseInt(localScore, 10) : this.score
    this.highestScore = score
    return score
  }

  public handleBallCompleted(isScored: boolean) {
    if (isScored) {
      this.score ++
      this.setRandomBallWithLevel()
    } else {
      this.isDead = true
      if (this.score > this.highestScore) {
        this.isNewHScore = true
        this.setHighestScore(this.score)
      }
    }
  }

  public twoDigit(n: number): string {
    if (n < 10) {
      return `0${n}`
    } else {
      return n.toString()
    }
  }

  public async fetchRankArr() {
    try {
      this.rankArr = await this.gameData.getScores()
    } catch (error) {
      console.error(error)
    }
  }

  public mounted() {
    this.getHighestScore()
    this.fetchRankArr()
  }

  // @Watch('score')
  // private onScoreChanged(score: number) {
  // }

}
</script>
<style lang="sass">
  @import './style.sass'
</style>

