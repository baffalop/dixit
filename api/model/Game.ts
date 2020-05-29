import Player from './player'
import {
  Action,
  ActionToStage,
  GameData,
  Guess,
  MakeClue,
  PlayCard,
  Stage,
} from './GameData'
import Deck from '../Deck'
import Round from './Round'
import PlayedCard from './PlayedCard'

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

  public takeAction (player: Player, action: Action) {
    const stage = this.getStage()
    if (stage != ActionToStage[action.action]) {
      console.log(`${player} attempted ${action.action} but stage is ${stage}`)
      player.sendError(`Your action is out of sequence. Currently ${stage}`)
      return
    }

    switch (action.action) {
      case 'clue':
        this.makeClue(player, action)
        break
      case 'play':
        this.playCard(player, action)
        break
      case 'guess':
        this.guess(player, action)
        break
    }
  }

  private makeClue (player: Player, action: MakeClue) {
    try {
      const playedCard = this.collectCard(player, action.card)
      this.round = new Round(playedCard, action.clue)
    } catch {
      return
    }

    if (this.turn === null) {
      this.turn = this.players.indexOf(player)
    }
    this.allPlayersCanPlay()

    this.broadcast()
  }

  private playCard (player: Player, action: PlayCard) {
    try {
      const playedCard = this.collectCard(player, action.card)
      this.round!.addCard(playedCard)
    } catch {
      return
    }

    if (this.getStage() == Stage.Guessing) {
      this.allPlayersCanPlay()
    } else {
      player.setCanPlay(false)
    }

    this.broadcast()
  }

  private guess (player: Player, action: Guess) {
    try {
      this.round!.guess(player, action.card)
    } catch {
      console.log(`${player} guessed card ${action.card} but it wasn't found in Round`)
      player.sendError('The card you guessed is invalid')
      return
    }

    player.setCanPlay(false)

    if (this.getStage() == Stage.Scoring) {
      this.round!.score()
      this.broadcast()
      setTimeout(() => this.passTurn(), 10000)
    }
  }

  private collectCard (player: Player, card: string): PlayedCard {
    try {
      player.takeCardFromHand(card)
    } catch (e) {
      console.log(`${player} tried to play card ${card} but doesn't have it in hand`)
      player.sendError("You can't play this card: it's not in your hand")
      throw e
    }

    this.deal(player)
    return new PlayedCard(card, player)
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
    const playerIndex = this.players.indexOf(player)
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

    this.players[index].setCanPlay(true)
    this.turn = index
  }

  private dealIn (player: Player) {
    for (let i = 0; i < HAND_SIZE; i++) {
      this.deal(player)
    }
  }

  private deal (player: Player) {
    try {
      const card = this.deck.pop()
      player.deal(card)
    } catch (e) {
      throw new Error('Out of cards!')
    }
  }

  private passTurn () {
    if (this.turn === null) {
      return
    }
    this.round = null
    this.setTurn((this.turn + 1) % this.players.length)
  }

  private allPlayersCanPlay () {
    const playerWhoseTurnItIs = this.turn === null ? null : this.players[this.turn]
    this.players.forEach(player => player !== playerWhoseTurnItIs && player.setCanPlay(true))
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
