import { Database, RunResult } from "sqlite3"

class EventsDBManager {
  
  db: Database

  constructor() {
    this.db = new Database('database/db.events')
  }

  createTable(){

    const query = 
      `
      CREATE TABLE IF NOT EXISTS events (
      eventId INTEGER PRIMARY KEY AUTOINCREMENT,
      title VARCHAR(100) NOT NULL,
      description TEXT NOT NULL,
      datetime DATETIME NOT NULL
      )
      ` 
    this.db.run(query, (err: Error) => {err ? console.log(err) : console.log('Successfully created table!')})
  }

  addEvent(title: string, description: string, datetime: Date) {
    const query = 
    `
      INSERT INTO events (title, description, datetime) 
      VALUES ('${title}', '${description}', '${datetime.toISOString().slice(0,19).replace('T', ' ')}')
    `

    this.db.run(query, (err: Error) => {err ? console.log(err) : console.log('Succesfully added entry to table!')})
  }

  getEvents() {
    const query = `SELECT * FROM events`
    return new Promise((resolve, reject) => {
      this.db.all(query, (err: Error, rows: any[]) => {err ? reject(err) : resolve(rows)})})
  }

  getEvent(id: number) {
    const query = `SELECT * FROM events WHERE eventId = ${id}`
    return new Promise((resolve, reject) => {
      this.db.get(query, (err: Error, rows: any[]) => {err ? reject(err) : resolve(rows)})})
  }

}

export default EventsDBManager
