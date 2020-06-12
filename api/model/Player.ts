import WebSocket, { MessageEvent } from 'ws'
import { PlayerData, GameData, isAction } from './GameData'
import Game from './Game'

export default class Player {
  readonly name: string
  readonly game: Game

  private score: number = 0
  private hand: string[] = []
  private canPlay: boolean = false

  private ws: WebSocket | null = null

  constructor (name: string, game: Game) {
    this.name = name
    this.game = game
  }

  public getName () {
    return this.name
  }

  public deal (card: string) {
    this.hand.push(card)
  }

  public giveScore (score: number) {
    this.score += score
  }

  public send (data: GameData | string) {
    if (!this.ws) {
      console.log(`Attempted to send data to '${this.name}' but socket is not initialised`)
      return
    }

    if (this.ws.readyState !== WebSocket.OPEN) {
      console.log(`Attempted to send data to '${this.name}' but socket is not open`)
      return
    }

    let message
    if (typeof data == 'string') {
      message = data
      console.log(`Sending message to '${this.name}': ${message}`)
    } else {
      const gameData = {
        ...data,
        hand: this.hand,
        myTurn: this.canPlay,
      }

      console.log(`Sending data to '${this.name}'`)
      console.log(gameData)

      message = JSON.stringify(gameData)
    }

    this.ws.send(message)
  }

  public sendError (message: string) {
    this.send(message)
  }

  public getData (): PlayerData {
    return {
      name: this.name,
      score: this.score,
      turn: this.canPlay,
    }
  }

  public setSocket (ws: WebSocket) {
    this.ws = ws
    this.ws.addEventListener('message', this.onMessage.bind(this))
  }

  public setCanPlay (canPlay: boolean) {
    this.canPlay = canPlay
  }

  public getHand (): string[] {
    return this.hand
  }

  public takeCardFromHand (card: string) {
    const index = this.hand.indexOf(card)
    if (index == -1) {
      throw new Error(`Card ${card} not found in hand`)
    }
    this.hand.slice(index, 1)
  }

  private onMessage (ev: MessageEvent) {
    console.log(`${this.name} received message`)

    if (typeof ev.data !== 'string') {
      console.log('Data is not string. Ignoring.')
      return
    }

    let data
    try {
      data = JSON.parse(ev.data)
    } catch (e) {
      console.log('Data is not JSON. Ignoring.')
    }

    if (!isAction(data)) {
      console.log('Data does not specify action. Ignoring')
      console.log(data)
      return
    }

    if (!this.canPlay) {
      console.log(`${this.name} attempted action ${data.action} but it's not their turn`)
      this.sendError("It's not your turn")
      return
    }

    this.game.takeAction(this, data)
  }
}
