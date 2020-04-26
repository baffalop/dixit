<template>
  <div id="app">
    <img class="logo" alt="Dixit logo" src="./assets/logo-dixit.png">
    <div class="main">

      <WelcomeScreen v-if="playState === 'login'" :initialName="name" :message="loginError" @submit="onSubmit" />
      <Loader v-else-if="playState === 'loading'" />
      <Game v-else :gameData="playState" :client="playClient" @quit="quitPlay()" />

    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import WelcomeScreen from './components/WelcomeScreen.vue'
import Loader from '@/components/Loader.vue'
import Game from '@/components/Game.vue'
import axios from 'axios'
import { PlayClient, ConnectError } from '@/util/PlayClient'
import { GameData } from '@/util/GameData'

const LOGIN_ENDPOINT = '/login'

type PlayState = 'login' | 'loading' | GameData
class LoginError extends Error {}

@Component({
  components: {
    WelcomeScreen,
    Loader,
    Game,
  },
})

export default class App extends Vue {
  private name = ''
  private playState: PlayState = 'login'

  private loginError = ''

  private playClient: PlayClient | null = null

  private async onSubmit ({ name }: { name: string }) {
    console.log(`Submitting name: ${name}`)

    this.name = name
    this.playState = 'loading'

    try {
      await this.login()
      const gameData = await this.connect()
      console.log('Connected')
      this.playState = gameData
    } catch (e) {
      this.playState = 'login'
      this.loginError = e.message
    }
  }

  /**
   * @throws LoginError
   */
  private async login (): Promise<object | string> {
    try {
      const { data: response } = await axios.post(LOGIN_ENDPOINT, { name: this.name })

      console.log('We\'re in!')
      console.log(response)

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
  private async connect (): Promise<GameData> {
    this.playClient = new PlayClient(this.name)
    try {
      const data = await this.playClient.login(this.onMessage, this.onSocketClosed)

      if (typeof data === 'string') {
        this.playClient.quit()
        throw new LoginError(data)
      }

      return data
    } catch (e) {
      throw new LoginError(e.message + ' Please try again.')
    }
  }

  private quitPlay () {
    this.playClient?.quit()
    this.playState = 'login'
    this.loginError = ''
  }

  private onMessage (data: GameData | string) {
    if (typeof data === 'string') {
      console.log(`Message: ${data}`)
      return
    }

    this.playState = data
  }

  private onSocketClosed (ev: CloseEvent) {
    console.log('Socket closed')
    console.log(ev)
    this.playState = 'login'
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

  input[type=submit], button {
    background: #e9c98e;
    color: #46363f;
    border: none;
    margin: 15px;
    font-family: 'Noto Serif', serif;
    font-weight: bold;
    font-size: 1.2em;
    box-shadow: inset 0 0 20px #46363f;
    transition: box-shadow ease-out 0.2s;
  }

  input[type=submit]:hover, button:hover {
    box-shadow: inset 0 0 25px #241c20;
    cursor: pointer;
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
