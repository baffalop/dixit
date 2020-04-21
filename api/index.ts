import express from 'express'
import http from 'http'
import Game from './model/game'
import Player from './model/player'

const game = new Game()

const app = express()
const server = http.createServer(app)

app.post('/login', express.json())
app.post('/login', (req, res) => {
  if (!req.body.hasOwnProperty('name')) {
    res.status(400).send('Name field required')
  }

  const name: string = req.body.name
  console.log(`Got name ${name}`)

  if (game.hasPlayerName(name)) {
    console.log(`Game has player with that name. Responding with error.`)
    res.status(400).send(`We already have a '${name}'. Try for something original.`)
    return
  }

  const player = new Player(name)
  game.addPlayer(player)

  console.log('Player added to game')
  res.status(200).send({
    name: name,
    hand: player.getHand(),
    players: game.getPlayers(player),
  })
})

server.listen(3000, () => {
  console.log('listening on *:3000')
})
