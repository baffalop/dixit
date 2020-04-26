import WebSocket from 'ws'

export default class Player {
  private name: string
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

  public getHand () : string[] {
    return this.hand
  }

  setSocket (ws: WebSocket) {
    this.ws = ws
  }
}
