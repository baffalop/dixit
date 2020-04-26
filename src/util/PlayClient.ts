import { GameData, isGameData } from '@/util/GameData'

const PLAY_ENDPOINT = 'play'

class ConnectError extends Error {}

class PlayClient {
  readonly name: string

  private onDataCallback: ((data: GameData | string) => void) | null = null
  private onCloseCallback: ((ev: CloseEvent) => void) | null = null

  private ws: WebSocket | null = null
  private connected = false

  /**
   * @param name
   *
   * @throws ConnectError
   */
  constructor (name: string) {
    this.name = name
  }

  public isInPlay (): boolean {
    return this.connected
  }

  public getSocketState () {
    return this.ws?.readyState
  }

  /**
   * Starts WebSocket and sends first login message. Promise is resolved when login message is acknowledged.
   *
   * @param onData Callback on receipt of messages. Parameter is JSON decoded message data.
   * @param onClose Callback on (unexpected) closing of socket. Parameter is close event.
   *
   * @throws ConnectError If the connection is closed before login is complete
   */
  public login (onData: (data: GameData | string) => void, onClose: (ev: CloseEvent) => void): Promise<GameData | string> {
    this.onDataCallback = onData
    this.onCloseCallback = onClose

    return new Promise((resolve: (data: GameData | string) => void, reject: (e: ConnectError) => void) => {
      try {
        this.ws = new WebSocket(this.buildUrl())
      } catch (e) {
        this.clearEvents()
        reject(e)
        return
      }

      const onLoginClose = (ev: CloseEvent) => {
        console.log('Socket closed during connection/login')
        console.log(ev)
        reject(new ConnectError('Connection was lost during login.'))
      }
      this.ws!.addEventListener('close', onLoginClose)

      this.ws!.addEventListener('open', () => {
        console.log('Socket opened')

        this.send({ name: this.name })

        const onLoginAck = (ev: MessageEvent) => {
          console.log('Received reply to login message')
          this.onMessage(ev)

          this.ws!.removeEventListener('message', onLoginAck)
          this.ws!.addEventListener('message', this.onMessage.bind(this))

          this.ws!.removeEventListener('close', onLoginClose)
          this.ws!.addEventListener('close', this.onClose.bind(this))

          this.connected = true
          resolve(this.decodeData(ev.data))
        }

        this.ws!.addEventListener('message', onLoginAck)
      })
    })
  }

  public quit () {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.log('Stop called with no WebSocket open')
      return
    }
    this.onCloseCallback = null
    this.ws.close(4001, 'Quitting')
  }

  public takeTurn () {
    this.send({ action: 'play' })
  }

  /**
   * @param data
   *
   * @throws Error
   */
  private send (data: object | string) {
    if (this.ws === null) {
      throw new Error('WebSocket not initialised')
    }

    if (this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not open')
    }

    if (typeof data === 'string') {
      this.ws.send(data)
      return
    }

    this.ws.send(JSON.stringify(data))
  }

  private onMessage (ev: MessageEvent) {
    const data = this.decodeData(ev.data)
    console.log('Received message')
    console.log(data)
    this.onDataCallback && this.onDataCallback(data)
  }

  private onClose (ev: CloseEvent) {
    this.onCloseCallback && this.onCloseCallback(ev)
    this.connected = false
    this.clearEvents()
  }

  private decodeData (data: string): GameData | string {
    try {
      const dataObject = JSON.parse(data)
      if (isGameData(dataObject)) {
        return dataObject
      }
      console.log('Data is not instance of GameData. Returning as string.')
      return data
    } catch (e) {
      console.log('Data is not JSON. Returning as string.')
      return data
    }
  }

  private clearEvents () {
    this.onDataCallback = null
    this.onCloseCallback = null
    this.ws?.removeEventListener('close', this.onClose)
    this.ws?.removeEventListener('message', this.onMessage)
  }

  private buildUrl (): string {
    const loc = window.location
    const protocol = loc.protocol === 'https:' ? 'wss' : 'ws'
    return `${protocol}://${loc.host}/${PLAY_ENDPOINT}`
  }
}

export { PlayClient, ConnectError }
