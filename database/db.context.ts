import EventsDBManager from "../database/db.events.manager";
import EventRepository from "../database/event.repository";

const dbManager = new EventsDBManager();               
dbManager.createTable();                         
const db = dbManager.getDb();

export const eventRepository = new EventRepository(db); 
export { dbManager }; 
