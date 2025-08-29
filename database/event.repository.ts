import { Database } from "sqlite3";

export type EventRow = {
  eventId: number;
  title: string;
  description: string;
  datetime: string; 
};

class EventRepository {
    private db: Database;

    constructor(db: Database) {
        this.db = db;
    }

    addEvent(title: string, description: string, datetime: string): Promise<string> {
        const query = 
        `
        INSERT INTO events (title, description, datetime) 
        VALUES ('${title}', '${description}', '${datetime}')
        `

        return new Promise((resolve, reject) => {
        this.db.run(query, (err: Error) => {err ? reject(err) : resolve('Succesfully added entry to table!')})
        })
    }

    getEvents(): Promise<EventRow[]> {
        const query = `SELECT * FROM events`
        return new Promise((resolve, reject) => {
            this.db.all(query, (err: Error | null, rows?: EventRow[]) => (err ? reject(err) : resolve(rows ?? [])));       
        })
    }

    getEvent(id: number): Promise<EventRow> {
        const query = `SELECT * FROM events WHERE eventId = ${id}`
        return new Promise((resolve, reject) => {
            this.db.get(query, (err: Error, row?: EventRow) => {
                if (err) return reject(err);
                if (!row) return reject(null);        // <-- matches your test: rejects.toBeNull()
                resolve(row);
            })
        })
    }

}

export default EventRepository


