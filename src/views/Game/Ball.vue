<template>
  <div
    class="football"
    ref="football"
    :data-start-ts="option.startTS"
    @click="handleClick">
    <img
      ref="ballImg"
      :class="{ 'is-point': isPoint, 'is-scored': isScored }"
      src="http://pngimg.com/uploads/football/football_PNG1091.png" alt="">
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { BallOption } from '@/types'

@Component({
})
export default class Ball extends Vue {
  @Prop({
    default: {
      startTS: new Date().getTime(),
      sx: 50,
      sy: 70,
      x: 50,
      y: 70,
      sSize: 0.3,
      size: 1,
      duration: 1,
      pointDuration: 1.5,
    },
  })
  public option!: BallOption

  public isInit: boolean = true
  public isPoint: boolean = false
  public isScored: boolean = false
  public timer!: number

  public get isSamePosition(): boolean {
    const { sx, sy, x, y, duration } = this.option
    return sx === x && sy === y
  }

  public async init() {
    if (this.isInit && !this.isSamePosition) {
      const ball = this.$refs.football
      const { sx, sy, x, y, duration, pointDuration, sSize, size } = this.option
      const turnPoint = {
        x: x + (sx - x) / 2,
        y: y + (y - sy) / 2,
        size: size / 2,
      }

      this.isPoint = false
      this.isScored = false
      this.isInit = false
      turnPoint.y = turnPoint.y < 0 ? 0 : turnPoint.y

      // set ball to start position
      this.setPosition(ball, sx, sy, sSize, 0)
      // HACK: Fix issuae about no transition in initializtion
      this.getValueFromDom(this.$refs.football, '--x')

      await this.setPosition(ball, turnPoint.x, turnPoint.y, turnPoint.size, duration / 2)
      await this.setPosition(ball, x, y, size, duration / 2)
      this.isPoint = true
      this.timer = window.setTimeout(() => {
        this.handleCompleted()
      }, pointDuration * 1000)
    }
  }

  public setPosition(dom: any, x: number, y: number, size: number, duration: number) {
    return new Promise((resolve, reject) => {
      let count = 0
      const handleEnd = () => {
        count ++
        if (count >= 3) {
          dom.removeEventListener('transitionend', handleEnd)
          resolve()
        }
      }
      this.setValueFromDom(dom, '--duration', `${duration}s`)
      this.setValueFromDom(dom, '--x', `${x}%`)
      this.setValueFromDom(dom, '--y', `${y}%`)
      this.setValueFromDom(dom, '--size', `${size}`)
      dom.addEventListener('transitionend', handleEnd)
    })
  }

  public handleClick() {
    if (!this.isPoint) { return }
    clearTimeout(this.timer)
    this.isPoint = false
    this.isScored = true
    setTimeout(() => {
      this.handleCompleted()
    }, 300)
  }

  public handleCompleted() {
    this.isInit = true
    this.$emit('completed', this.isScored)
  }

  public getValueFromDom(dom: any, valueName: string) {
    return getComputedStyle(dom).getPropertyValue(valueName)
  }

  public setValueFromDom(dom: any, valueName: string, value: string) {
    if (dom) { dom.style.setProperty(valueName, value) }
  }

  private mounted() {
    this.init()
  }

  private async beforeUpdate() {
    this.init()
  }
}
</script>

<style lang="sass" scoped>
@keyframes spin
  25%
    transform: rotate(90deg) scale(1.2, 1)
  50%
    transform: rotate(180deg) scale(1, 1.2)
  100%
    transform: rotate(360deg)

@keyframes bigger
  30%
    transform: scale(1.5)
  50%
    transform: scale(2)
  80%
    transform: scale(1.5)
    opacity: 0.8
  100%
    transform: scale(1)
    opacity: 0.5

.football
    --x: 50%
    --y: 70%
    --duration: 0
    --size: 0.3
    position: absolute
    left: var(--x)
    top: var(--y)
    display: flex
    justify-content: center
    align-items: center
    width: 10%
    height: 10%
    filter: brightness(var(--size))
    transition-property: all
    transition-duration: var(--duration)
    transition-timing-function: ease-in
    animation: spin .2s ease-in-out infinite
    img
      width: 100%
      transform: scale(var(--size))
      transition-property: all
      transition-duration: var(--duration)
      transition-timing-function: ease-in
      &.is-point
        cursor: pointer
      &.is-scored
        animation: bigger .3s ease-in-out forwards
</style>