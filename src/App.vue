<template>
  <div id="app">
    <img class="logo" alt="Dixit logo" src="./assets/logo-dixit.png">
    <div class="main">
      <div v-if="playing">
        <h1>We're in!</h1>
        <button @click="quitPlay()">Quit</button>
      </div>
      <Loader v-else-if="loading" />
      <WelcomeScreen v-else :initialName="name" :message="loginError" @submit="onSubmit" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import WelcomeScreen from './components/WelcomeScreen.vue'
import Loader from '@/components/Loader.vue'
import axios from 'axios'
import { PlayClient, ConnectError } from '@/util/PlayClient'

const LOGIN_ENDPOINT = '/login'

class LoginError extends Error {}

@Component({
  components: {
    WelcomeScreen,
    Loader,
  },
})

export default class App extends Vue {
  private name = ''
  private hand: string[] = []

  private loginError = ''
  private loading = false
  private playing = false

  private playClient: PlayClient | null = null

  private async onSubmit ({ name }: { name: string }) {
    console.log(`Submitting name: ${name}`)

    this.name = name
    this.loading = true

    try {
      const { hand }: { name: string; hand: string[] } = await this.login()
      this.hand = hand
      await this.connect()
      console.log('Connected')

      this.loading = false
      this.playing = true
    } catch (e) {
      this.loading = false
      this.loginError = e.message
    }
  }

  /**
   * @throws LoginError
   */
  private async login (): Promise<{ name: string; hand: string[] }> {
    try {
      const { data: response } = await axios.post(LOGIN_ENDPOINT, { name: this.name })

      console.log('We\'re in!')
      console.log(response)

      if (!response.hand) {
        console.log('Error: Login did not return hand')
        throw new LoginError('Got an unexpected response. Please try again.')
      }

      return response
    } catch (e) {
      if (e instanceof LoginError) {
        throw e
      }

      console.log('Shoot!')
      console.log(e)

      let errorMessage: string
      if (e.response) {
        if (e.response.status < 500) {
          errorMessage = e.response.data
        } else {
          errorMessage = `The server didn't like that... (status ${e.response.status})`
        }
      } else {
        errorMessage = 'Did Nikita remember to run the server?'
      }

      throw new LoginError(errorMessage)
    }
  }

  /**
   * @throws ConnectError
   */
  private async connect () {
    this.playClient = new PlayClient(this.name)
    try {
      await this.playClient.login(this.onMessage, this.onSocketClosed)
    } catch (e) {
      throw new LoginError(e.message + ' Please try again.')
    }
  }

  private quitPlay () {
    this.playClient?.quit()
    this.playing = false
    this.loginError = ''
  }

  private onMessage (data: object | string) {
    console.log('Message received')
    console.log(data)
  }

  private onSocketClosed (ev: CloseEvent) {
    console.log('Socket closed')
    console.log(ev)
    this.playing = false
    this.loginError = 'Connection lost. Please try logging in again.'
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
