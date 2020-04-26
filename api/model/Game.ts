import Player from './player'
import { GameData } from './GameData'

const CARD_COUNT = 100
const HAND_SIZE = 6
const DIGITS_IN_CARD_ID = 5

export default class Game {
  private players: Player[] = []
  private turn: number | null = null
  private deck: string[] = []

  constructor () {
    this.shuffleDeck()
  }

  public addPlayer (player: Player) {
    this.dealIn(player)
    this.players.push(player)
  }

  public getPlayer (name: string) {
    return this.players.find(player => player.getName() == name)
  }

  public getPlayers (excluding: Player|null) {
    if (!excluding) {
      return this.players
    }
    return this.players.filter(player => player !== excluding)
  }

  public hasPlayerName (name: string) {
    return this.players.some(player => player.getName() == name)
  }

  public broadcast (from: Player | null = null) {
    const data = this.getGameData()
    for (const player of this.players) {
      if (player !== from) {
        player.send(data)
      }
    }
  }

  public sendGameData (to: Player) {
    this.players.find(player => player === to)
      ?.send(this.getGameData())
  }

  public getGameData (): GameData {
    return {
      players: this.players.map(player => player.getData()),
      turn: this.turn,
    }
  }

  private dealIn (player: Player) {
    for (let i = 0; i < HAND_SIZE; i++) {
      const card = this.deck.pop()
      if (card === undefined) {
        throw new Error('Out of cards!')
      }
      player.deal(card)
    }
  }

  private shuffleDeck () {
    // use "inside-out" Fisher-Yates shuffle to generate cards in a random order
    for (let i = 0; i < CARD_COUNT; i++) {
      const j = Math.round(Math.random() * i)
      this.deck[i] = this.deck[j]
      this.deck[j] = Game.intToCard(i)
    }
  }

  private static intToCard (i: number) {
    return (i + 1).toString().padStart(DIGITS_IN_CARD_ID, '0')
  }

  playerExit (player: Player) {
    const playerIndex = this.players.findIndex(p => p === player)
    if (playerIndex == -1) {
      console.log(`Could not find player to remove: ${player.getName()}`)
      return
    }

    this.players.splice(playerIndex, 1)
    if (this.turn !== null && this.turn >= playerIndex) this.turn--
    console.log(`Player removed: ${player.getName()}`)

    this.broadcast()
  }
}
