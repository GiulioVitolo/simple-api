import express from 'express'
import eventRouter from './routers/event.router'

const PORT = 3000
const app = express()

app.use(express.json())
app.use('/events', eventRouter)

app.listen(PORT, () => {
  console.log('Server listening on port', PORT, '...')
})
