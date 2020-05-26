export interface Player {
  name: string
  score: number
  turn: boolean
}

export function isPlayer (value: any): value is Player {
  const { name, score, turn } = (value as Player)
  return (
    typeof name == 'string' &&
    typeof score == 'number' &&
    typeof turn == 'boolean'
  )
}

export enum Stage {
  AwaitingClue = 'AwaitingClue',
  CollectingCards = 'CollectingCards',
  Guessing = 'Guessing',
  Scoring = 'Scoring',
}

export interface GameData {
  hand: string[]
  players: Player[]
  turn: number | null
  myTurn: boolean
  stage: Stage
}

export function isGameData (value: object): value is GameData {
  const {
    hand,
    players,
    turn,
    myTurn,
    stage,
  } = (value as GameData)

  return (
    hand instanceof Array &&
    players instanceof Array &&
    (typeof turn == 'number' || turn === null) &&
    typeof myTurn == 'boolean' &&
    typeof stage == 'string' &&
    hand.every(card => typeof card == 'string') &&
    players.every(isPlayer)
  )
}
