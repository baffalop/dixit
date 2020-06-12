export interface Player {
  name: string
  score: number
  canPlay: boolean
}

export function isPlayer (value: object): value is Player {
  const { name, score, canPlay } = (value as Player)
  return (
    typeof name == 'string' &&
    typeof score == 'number' &&
    typeof canPlay == 'boolean'
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
  canPlay: boolean
  stage: Stage
  clue: string | null
}

export function isGameData (value: object): value is GameData {
  const {
    hand,
    players,
    turn,
    canPlay,
    stage,
    clue,
  } = (value as GameData)

  return (
    hand instanceof Array &&
    players instanceof Array &&
    (typeof turn == 'number' || turn === null) &&
    typeof canPlay == 'boolean' &&
    typeof stage == 'string' &&
    (typeof clue == 'string' || clue === null) &&
    hand.every(card => typeof card == 'string') &&
    players.every(isPlayer)
  )
}
