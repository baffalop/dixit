interface Player {
  name: string;
  score: number;
}

function isPlayer (value: any): value is Player {
  const { name, score } = (value as Player)
  return (
    typeof name === 'string' &&
    typeof score === 'number'
  )
}

interface GameData {
  hand: string[];
  players: Player[];
  turn: number | null;
}

function isGameData (value: object): value is GameData {
  const { hand, players, turn } = (value as GameData)
  return (
    hand instanceof Array &&
    players instanceof Array &&
    (typeof turn === 'number' || turn === null) &&
    hand.every(card => typeof card === 'string') &&
    players.every(isPlayer)
  )
}

export { Player, isPlayer, GameData, isGameData }
