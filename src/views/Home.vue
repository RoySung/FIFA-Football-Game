<template>
  <div class="home">
    <img src="../assets/logo.png">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/game">Game</router-link> |
      <router-link to="/about">About</router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {
  },
})
export default class Home extends Vue {}
</script>
<style lang="scss">
  #nav {
    padding: 30px;
    a {
      font-weight: bold;
      color: #2c3e50;
      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }
</style>

