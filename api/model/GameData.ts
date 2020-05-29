export interface PlayerData {
  name: string
  score: number
  turn: boolean
}

export enum Stage {
  AwaitingClue = 'awaiting clue',
  CollectingCards = 'collecting cards',
  Guessing = 'guessing',
  Scoring = 'scoring',
}

export interface GameData {
  players: PlayerData[]
  turn: number | null
  stage: Stage
}

enum ActionName {
  Clue = 'clue',
  Play = 'play',
  Guess = 'guess',
}

export interface MakeClue {
  action: ActionName.Clue
  clue: string
  card: string
}

export interface PlayCard {
  action: ActionName.Play
  card: string
}

export interface Guess {
  action: ActionName.Guess
  card: string
}

export type Action = MakeClue | PlayCard | Guess

export function isAction (data: unknown): data is Action {
  if (typeof data != 'object' || data === null)
    return false

  switch ((data as { action: string }).action) {
    case ActionName.Clue:
      const { clue, card } = (data as MakeClue)
      return typeof clue == 'string' && typeof card == 'string'
    case ActionName.Play:
    case ActionName.Guess:
      return typeof (data as Action).card == 'string'
    default:
      return false
  }
}

export const ActionToStage = {
  [ActionName.Clue]: Stage.AwaitingClue,
  [ActionName.Play]: Stage.CollectingCards,
  [ActionName.Guess]: Stage.Guessing,
}
