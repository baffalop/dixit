<template>
  <div id="app">
    <img class="logo" alt="Dixit logo" src="./assets/logo-dixit.png">
    <div class="main">
      <WelcomeScreen />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import WelcomeScreen from './components/WelcomeScreen.vue'

@Component({
  components: {
    WelcomeScreen,
  },
})

export default class App extends Vue {}
</script>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif:ital@0;1&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Trade+Winds&display=swap');

  body, html {
    background: #1f1923;
    font-size: 16pt;
  }
</style>

<style scoped>
  #app {
    color: #e9c98e;
    font-family: 'Noto Serif', serif;
    font-style: italic;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    margin-top: 60px;
  }

  .logo {
    width: 80%;
    max-width: 600px;
    margin-bottom: 40px;
  }

  .dialogue {
    display: inline-block;
    padding: 10px 15px;
    background: #462b36;
    box-shadow: 5px 5px 15px 0 #0e0a1073;
    min-width: 200px;
  }
</style>
