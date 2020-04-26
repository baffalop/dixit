import WebSocket from 'ws'
import { PlayerData, GameData } from './GameData'

export default class Player {
  private name: string
  private score: number = 0
  private hand: string[] = []

  private ws: WebSocket | null = null

  constructor (name: string) {
    this.name = name
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

  public getData (): PlayerData {
    return {
      name: this.name,
      score: this.score,
    }
  }

  public send (gameData: GameData) {
    if (!this.ws) {
      console.log(`Attempted to send data to '${this.name}' but socket is not initialised`)
      return
    }

    if (this.ws.readyState !== WebSocket.OPEN) {
      console.log(`Attempted to send data to '${this.name}' but socket is not open`)
      return
    }

    const data = {
      ...gameData,
      hand: this.hand,
    }

    console.log(`Sending data to '${this.name}'`)
    console.log(data)

    this.ws.send(JSON.stringify(data))
  }

  public getHand () : string[] {
    return this.hand
  }

  setSocket (ws: WebSocket) {
    this.ws = ws
  }
}
