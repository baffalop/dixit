const PLAY_ENDPOINT = 'play'

export default class PlayClient {
  private name: string
  private ws: WebSocket

  constructor (name: string) {
    this.name = name
    this.ws = new WebSocket(this.buildUrl())

    this.ws.addEventListener('open', () => {
      console.log('Socket opened')
      this.login()
    })

    this.ws.addEventListener('close', () => {
      console.log('Socket closed')
    })
  }

  private send (data: Record<string, any>|string) {
    if (typeof data === 'string') {
      this.ws.send(data)
      return
    }

    this.ws.send(JSON.stringify(data))
  }

  private login () {
    this.send({ name: this.name })
  }

  private buildUrl (): string {
    const loc = window.location
    const protocol = loc.protocol === 'https:' ? 'wss' : 'ws'
    return `${protocol}://${loc.host}/${PLAY_ENDPOINT}`
  }
}
