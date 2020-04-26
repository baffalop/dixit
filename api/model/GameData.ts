interface PlayerData {
  name: string
  score: number
}

interface GameData {
  players: PlayerData[]
  turn: number | null
}

export { PlayerData, GameData }
