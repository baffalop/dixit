export interface PlayerData {
  name: string
  score: number
  turn: boolean
}

export enum Stage {
  AwaitingClue = 'AwaitingClue',
  CollectingCards = 'CollectingCards',
  Guessing = 'Guessing',
  Scoring = 'Scoring',
}

export interface GameData {
  players: PlayerData[]
  turn: number | null
  stage: Stage
}

export interface MakeClue {
  action: 'clue'
  clue: string
  card: string
}

export interface PlayCard {
  action: 'play'
  card: string
}

export interface Guess {
  action: 'guess'
  card: string
}

export type Action = MakeClue | PlayCard | Guess
