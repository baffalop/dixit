import WebSocket, { MessageEvent } from 'ws'
import { PlayerData, GameData, Action } from './GameData'
import Game from './Game'

export default class Player {
  readonly name: string
  readonly game: Game

  private score: number = 0
  private hand: string[] = []
  private isTurn: boolean = false

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
      myTurn: this.isTurn,
    }

    console.log(`Sending data to '${this.name}'`)
    console.log(data)

    this.ws.send(JSON.stringify(data))
  }

  public getData (): PlayerData {
    return {
      name: this.name,
      score: this.score,
      turn: this.isTurn,
    }
  }

  public setSocket (ws: WebSocket) {
    this.ws = ws
    this.ws.addEventListener('message', this.onMessage.bind(this))
  }

  public setIsTurn (isTurn: boolean) {
    this.isTurn = isTurn
  }

  public getHand (): string[] {
    return this.hand
  }

  private onMessage (ev: MessageEvent) {
    console.log(`${this.name} received message`)

    if (typeof ev.data !== 'string') {
      console.log('Data is not string. Ignoring.')
      return
    }

    try {
      const data = JSON.parse(ev.data)
      if (!data.action) {
        console.log('Data does not specify action. Ignoring')
        return
      }

      this.onAction(data)
    } catch (e) {
      console.log('Data is not JSON. Ignoring.')
    }
  }

  private onAction (data: Action) {
    switch (data.action) {
      case 'play':
        if (!this.isTurn && this.game.getTurn() !== null) {
          console.log(`${this.name} tried to play but it's not their turn`)
          return
        }

        console.log(`${this.name} has played`)
        this.game.takeTurn(this)

        break
      default:
        console.log(`Unrecognised action: ${data.action}`)
    }
  }
}
