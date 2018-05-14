<template>
  <div class="game-wrap">
    <div class="score-wrap">
      <div class="score-label">Score</div>
      <div class="score-text" v-html="score"></div>
    </div>
    <div
      ref="football"
      class="football"
      v-if="!isInit"
      @click="handleClick">
      <img ref="ballImg" :class="{ scored: isScored }" src="http://pngimg.com/uploads/football/football_PNG1091.png" alt="">
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';

@Component({
})
export default class Game extends Vue {
  public mainTimer: any = null;
  public reinitTimer: any = null;
  public isPoint: boolean = false;
  public isScored: boolean = false;
  public isInit: boolean = true;
  public score: number = 0;

  public x = 50;
  public y = 70;
  public size = 0.1;
  public brightness = 0.1;

  @Watch('x')
  public onXChanged(x: number) {
    this.setValueFromDom(this.$refs.football as HTMLElement, '--x', `${x}%`);
  }
  @Watch('y')
  public onYChanged(y: number) {
    this.setValueFromDom(this.$refs.football as HTMLElement, '--y', `${y}%`);
  }
  @Watch('size')
  public onSizeChanged(size: number) {
    this.setValueFromDom(this.$refs.football as HTMLElement, '--size', `${size}`);
  }
  @Watch('brightness')
  public onBrightnessChanged(brightness: number) {
    this.setValueFromDom(this.$refs.football as HTMLElement, 'filter', `brightness(${brightness})`);
  }

  public initBall(dom?: HTMLElement, x: number= 50, y: number= 70, size: number = 0.1, brightness: number = 0.1) {
    this.isPoint = false;
    this.isScored = false;
    this.isInit = true;
    this.mainTimer = setInterval(this.handleBall, 200);

    this.$nextTick(() => {
      this.isInit = false;
      this.x = x;
      this.y = y;
      this.size = size;
      this.brightness = brightness;
    });
  }

  public handleBall() {
    const x = parseInt(
      this.getValueFromDom(this.$refs.football as HTMLElement, '--x').replace('%', ''),
      10,
    );
    const y = parseInt(
      this.getValueFromDom(this.$refs.football as HTMLElement, '--y').replace('%', ''),
      10,
    );
    let size = parseFloat(
      this.getValueFromDom(this.$refs.football as HTMLElement, '--size'),
    );

    const rand = {
      x: this.randomWithRange(x - 25, x + 25),
      y: this.randomWithRange(y - 25, y + 25),
    };

    if (size < 1) {
      size = size + 0.1;
      this.x = rand.x;
      this.y = rand.y;
      this.size = size;
      this.brightness = size;
    } else {
      this.isPoint = true;
      this.setReinitTimer(1000);
      clearInterval(this.mainTimer);
    }
  }

  public setReinitTimer(time: number) {
    this.reinitTimer = setTimeout(() => {
      this.initBall(this.$refs.football as HTMLElement);
    }, time);
  }

  public handleClick() {
    if (!this.isPoint) { return; }
    clearTimeout(this.reinitTimer);
    this.setReinitTimer(300);
    this.isScored = true;
    this.score += 1;
  }

  public getValueFromDom(dom: HTMLElement, valueName: string) {
    return getComputedStyle(dom).getPropertyValue(valueName);
  }

  public setValueFromDom(dom: HTMLElement, valueName: string, value: string) {
    if (dom) { dom.style.setProperty(valueName, value); }
  }

  public randomWithRange(min: number, max: number) {
    if (min < 0) { min = 0; }
    if (max > 100) { max = 100; }
    return Math.floor(Math.random() * (max - min) + min);
  }

  public mounted() {
    this.initBall();
  }

}
</script>
<style lang="sass">
  @import './style.sass'
</style>

