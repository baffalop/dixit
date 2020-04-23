<template>
  <div id="app">
    <img class="logo" alt="Dixit logo" src="./assets/logo-dixit.png">
    <div class="main">
      <Loader v-if="loading" />
      <WelcomeScreen v-else :initialName="name" :message="loginError" @submit="onSubmit" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import WelcomeScreen from './components/WelcomeScreen.vue'
import Loader from '@/components/Loader.vue'
import axios from 'axios'

@Component({
  components: {
    WelcomeScreen,
    Loader,
  },
})

export default class App extends Vue {
  private name = ''
  private loginError = ''
  private loading = false

  private async onSubmit ({ name }: Record<string, string>) {
    this.loading = true
    this.name = name

    try {
      const { data: response } = await axios.post('/login', { name: this.name })
      this.loading = false
      console.log('We\'re in!')
      console.log(response)
    } catch (e) {
      this.loading = false
      console.log('Shoot!')
      console.log(e)

      if (e.response) {
        if (e.response.status < 500) {
          this.loginError = e.response.data
        } else {
          this.loginError = `The server didn't like that... (status ${e.response.status})`
        }
      } else {
        this.loginError = 'Did Nikita remember to run the server?'
      }
    }
  }
}
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
    height: 25vh;
    max-height: 220px;
    transform: translateX(-3%);
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
