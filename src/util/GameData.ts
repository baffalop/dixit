interface Player {
  name: string;
  score: number;
  turn: boolean;
}

function isPlayer (value: any): value is Player {
  const { name, score, turn } = (value as Player)
  return (
    typeof name === 'string' &&
    typeof score === 'number' &&
    typeof turn === 'boolean'
  )
}

interface GameData {
  hand: string[];
  players: Player[];
  turn: number | null;
  myTurn: boolean;
}

function isGameData (value: object): value is GameData {
  const { hand, players, turn, myTurn } = (value as GameData)
  return (
    hand instanceof Array &&
    players instanceof Array &&
    (typeof turn === 'number' || turn === null) &&
    typeof myTurn === 'boolean' &&
    hand.every(card => typeof card === 'string') &&
    players.every(isPlayer)
  )
}

export { Player, isPlayer, GameData, isGameData }
