<template>
  <div class="home">

    <div class="game">
      <span>
        <router-link to="/game">Game Play</router-link>
      </span>
    </div>
   
    <div id="nav">
      <router-link to="/">Home</router-link> |
      
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

// add effect
// $(function(){
//   $(".game span").hover(function(){
//     $(".home").css("filter"," grayscale(0)");
//   });
// });



</script>
<style lang="scss">
@font-face {
  font-family: Teko;
  src: url(../fonts/Teko-Bold.ttf);

}

  a{
    text-decoration: none;
    font-family: Teko !important;
  }


  .home{
    background: url(../assets/bgImg.jpg) no-repeat;
    /* background-size: cover; */
    background-size: 120%;
    background-position: center center;
    height: 100vh;
    filter: grayscale(0.8);
    transition: 1s;
    // &:hover{
    //   filter: grayscale(0);
    // }
  }

  .game{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
      span{
        color:#fff;
        font-weight: 600;
        font-size: 30px;
        display: flex;
        justify-content: center;
        
        &:hover{
          &::before{
            height: calc(50vh - 40px);
          }
           &::after{
            height: calc(50vh - 40px);
           }
          a{
            transform: none;
          }
          // .home{
          //   filter: grayscale(0);
          // }
        }
        &::before{
          content: "";
          display: block;
          position: absolute;
          width: 1px;
          height: calc(50vh - 60px);
          background: #fff;
          top:0px;
          transition-duration: 0.3s;

        }
        &::after{
          content: "";
          display: block;
          position: absolute;
          width: 1px;
          height: calc(50vh - 60px);
          background: #fff;
          bottom:0px;
          transition-duration: 0.3s;
        }

         a{
           color: #fff;
           transform: rotate(-40deg);
           transition-duration: 0.4s;
           text-transform: uppercase;
           padding: 50px;
           &:hover{
             
             
           }
         }
      }
  }
</style>

