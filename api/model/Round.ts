import Deck from '../Deck'
import Card from './PlayedCard'
import Player from './Player'

export default class Round {
  readonly clue: string
  private playedCard: Card
  private cards: Deck<Card>

  constructor (card: Card, clue: string) {
    this.clue = clue
    this.playedCard = card
    this.cards = new Deck<Card>([card])
  }

  public addCard (card: Card) {
    this.cards.add(card)
  }

  public guess (player: Player, card: string) {
    const existingCard = this.cards.all().find(c => c.name == card)

    if (!existingCard) {
      throw new Error(`No card '${card}' was played in this round`)
    }

    existingCard.guess(player)
  }

  public score () {
    const playerCount = this.cards.length()
    const playingPlayerWon = this.playedCard.countGuesses() != 0 && this.playedCard.countGuesses() != playerCount - 1
    if (playingPlayerWon)
      this.playedCard.getPlayedBy().giveScore(3)

    for (const player of this.playedCard.allGuesses()) {
      player.giveScore(3)
    }

    for (const card of this.cards.all()) {
      if (card === this.playedCard) {
        continue
      }

      card.getPlayedBy().giveScore(card.countGuesses() + (playingPlayerWon ? 0 : 2))
    }
  }

  public getTable (): string[] {
    return this.cards.all().map(card => card.name)
  }

  public countCards (): number {
    return this.cards.length()
  }

  public countGuesses (): number {
    return this.cards.all().reduce(
      (total, card) => total + card.countGuesses(),
      0
    )
  }
}
