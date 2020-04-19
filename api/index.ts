import express from 'express'
import http from 'http'

const app = express()
const server = http.createServer(app)

app.post('/login', express.json())
app.post('/login', (req, res) => {
  if (!req.body.hasOwnProperty('name')) {
    res.status(400).send('Name field required')
  }

  const name: string = req.body.name
  console.log(`got name ${name}`)
  res.status(200).send({
    name: name,
  })
})

server.listen(3000, () => {
  console.log('listening on *:3000')
})
