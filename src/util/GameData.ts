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
  AwaitingClue = 'awaiting clue',
  CollectingCards = 'collecting cards',
  Guessing = 'guessing',
  Scoring = 'scoring',
}

export interface GameData {
  hand: string[]
  players: Player[]
  turn: number | null
  myTurn: boolean
  stage: Stage
  clue: string | null
}

export function isGameData (value: object): value is GameData {
  const {
    hand,
    players,
    turn,
    myTurn,
    stage,
    clue,
  } = (value as GameData)

  return (
    hand instanceof Array &&
    players instanceof Array &&
    (typeof turn == 'number' || turn === null) &&
    typeof myTurn == 'boolean' &&
    typeof stage == 'string' &&
    (typeof clue == 'string' || clue === null) &&
    hand.every(card => typeof card == 'string') &&
    players.every(isPlayer)
  )
}
