import express from 'express'
import EventsDBManager from './database/db.events.manager'

const PORT = 3000
const app = express()
const db = new EventsDBManager()

db.getEvents().then((res) => console.log(res))

app.listen(PORT, () => {
  console.log('Server listening on port', PORT, '...')
})
