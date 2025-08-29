import { Database } from "sqlite3"

class EventsDBManager {
  
  db: Database

  constructor(dbPath: string = "database/db.events") {
    this.db = new Database(dbPath);
  }

  createTable(): Promise<string>{

    const query = 
      `
      CREATE TABLE IF NOT EXISTS events (
      eventId INTEGER PRIMARY KEY AUTOINCREMENT,
      title VARCHAR(100) NOT NULL,
      description TEXT NOT NULL,
      datetime DATETIME NOT NULL
      )
      ` 

    return new Promise((resolve, reject) => {
      this.db.run(query, (err: Error) => {err ? reject(err) : resolve('Successfully created table!')})
    })
  }

  getDb(): Database {
    return this.db
  }

  close(): void {
    this.db.close();
  }

}

export default EventsDBManager

  