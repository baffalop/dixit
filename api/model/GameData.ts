interface PlayerData {
  name: string
  score: number
  turn: boolean
}

interface GameData {
  players: PlayerData[]
  turn: number | null
}

type Action = {
  action: 'play'
}

export { PlayerData, GameData, Action }
