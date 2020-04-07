<template>
  <div id="app">
    <img class="logo" alt="Dixit logo" src="./assets/logo-dixit.png">
    <WelcomeScreen />
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
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  .logo {
    width: 80%;
    max-width: 600px;
  }
</style>
