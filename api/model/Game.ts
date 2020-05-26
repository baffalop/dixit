import Player from './player'
import { GameData, Stage } from './GameData'
import Deck from '../Deck'
import Round from './Round'

const CARD_COUNT = 100
const HAND_SIZE = 6
const DIGITS_IN_CARD_ID = 5

export default class Game {
  private players: Player[] = []
  private turn: number | null = null
  private deck = new Deck<string>()
  private round: Round | null = null

  constructor () {
    this.generateDeck()
  }

  public addPlayer (name: string): Player {
    const player = new Player(name, this)
    this.dealIn(player)
    this.players.push(player)
    return player
  }

  public takeTurn (player: Player) {
    const playerIndex = this.players.indexOf(player)
    if (playerIndex == -1) {
      console.log(`I don't have a '${player.getName()}`)
      return
    }

    if (this.turn === null) {
      this.setTurn(playerIndex)
    }

    player.giveScore(2)
    this.passTurn()
    this.broadcast()
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

  public playerExit (player: Player) {
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
      stage: this.getStage(),
    }
  }

  public getTurn (): number | null {
    return this.turn
  }

  private getStage (): Stage {
    if (!this.round) {
      return Stage.AwaitingClue
    }

    if (this.round.countCards() < this.players.length) {
      return Stage.CollectingCards
    }

    if (this.round.countGuesses() < this.players.length - 1) {
      return Stage.Guessing
    }

    return Stage.Scoring
  }

  private setTurn (index: number) {
    if (index >= this.players.length || index < 0) {
      throw new Error(`Turn index ${index} out of bounds (${this.players.length} players)`)
    }

    if (this.turn !== null && this.turn !== index) {
      this.players[this.turn].setIsTurn(false)
    }

    this.players[index].setIsTurn(true)
    this.turn = index
  }

  private dealIn (player: Player) {
    for (let i = 0; i < HAND_SIZE; i++) {
      try {
        const card = this.deck.pop()
        player.deal(card)
      } catch (e) {
        throw new Error('Out of cards!')
      }
    }
  }

  private passTurn () {
    if (this.turn === null) {
      return
    }
    this.setTurn((this.turn + 1) % this.players.length)
  }

  private generateDeck () {
    for (let i = 0; i < CARD_COUNT; i++) {
      this.deck.add(Game.intToCard(i))
    }
  }

  private static intToCard (i: number) {
    return (i + 1).toString().padStart(DIGITS_IN_CARD_ID, '0')
  }
}
