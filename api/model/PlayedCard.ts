import Player from './Player'

export default class PlayedCard {
  readonly name: string
  private from: Player
  private guesses = new Set<Player>()

  constructor (name: string, belongs: Player) {
    this.name = name
    this.from = belongs
  }

  public getPlayedBy (): Player {
    return this.from
  }

  public getPlayedByName (): string {
    return this.from.getName()
  }

  public guess (player: Player) {
    this.guesses.add(player)
  }

  public allGuesses (): Player[] {
    return Array.from(this.guesses)
  }

  public countGuesses (): number {
    return this.guesses.size
  }
}
