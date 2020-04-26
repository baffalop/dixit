import express from 'express'
import http from 'http'
import Game from './model/Game'
import Player from './model/Player'
import expressWs from 'express-ws'
import {CloseEvent} from 'ws'

const game = new Game()

const app = express()
const server = http.createServer(app)
const expressWsInstance = expressWs(app, server)

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

// @ts-ignore ws method injected by express-ws
app.ws('/play', (ws) => {
  console.log('New /play websocket. Listening for login.')

  const onLogin = (msg: string) => {
    console.log(`Received websocket message: ${msg}`)

    let data
    try {
      data = JSON.parse(msg.toString())
    } catch (err) {
      console.log('Data not parsable as JSON. Closing socket.')
      ws.close(1007, 'Could not parse JSON')
      return
    }

    if (!data.hasOwnProperty('name')) {
      console.log('Received first message without name. Closing socket.')
      ws.close(1008, 'First message must contain name')
      return
    }

    const name = data.name
    const player = game.getPlayer(name)
    if (!player) {
      console.log(`Closing socket: no player found with name '${name}'`)
      ws.close(4003, 'Player name not found. Please login first.')
      return
    }

    console.log(`Socket successfully matched with player '${name}'`)

    ws.removeEventListener('message', onLogin)
    ws.addEventListener('close', (ev: CloseEvent) => {
      console.log(`Connection closed for ${player.getName()} (${ev.code} ${ev.reason})`)
      game.playerExit(player)
    })

    player.setSocket(ws)
    game.broadcast()
  }

  ws.on('message', onLogin)
})

server.listen(3000, () => {
  console.log('listening on *:3000')
})
