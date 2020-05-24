export interface PlayerData {
  name: string
  score: number
  turn: boolean
}

export interface GameData {
  players: PlayerData[]
  turn: number | null
}

export type Action = {
  action: 'play'
}
