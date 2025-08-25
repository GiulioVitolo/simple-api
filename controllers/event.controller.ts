import { Request, Response, NextFunction } from "express";
import EventsDBManager from "../database/db.events.manager";
import { validateAndParse, setNotification } from "../utils/utils.db.events";

const eventsDB = new EventsDBManager()

export async function addEvent(req: Request, res: Response, next: NextFunction) {
  try {
    const {title, description, datetime} = req.body
    
    const sqlDatetime = validateAndParse(datetime)

    if (!title) throw Error('User must insert title')
    if (!description) throw Error('User must insert description')
    if (!datetime) throw Error('User must insert datetime')

    const result = await eventsDB.addEvent(title, description, sqlDatetime)

    setNotification(title, datetime)

    res.status(200).send(result)
  } catch (err) {
    next(err)
  }
}

export async function getEvents(req: Request, res: Response, next: NextFunction) {
  try {
    const events = await eventsDB.getEvents()
    res.status(200).send(events)
  } catch (err) {
    next(err)
  }
}

export async function getEvent(req: Request, res: Response, next: NextFunction) {
  try {
    const event = await eventsDB.getEvent(Number(req.params.id))
    res.status(200).send(event)
  } catch (err) {
    next(err)
  }
}
