import { Request, Response, NextFunction } from "express";
import EventsDBManager from "../database/db.events.manager";

const eventsDB = new EventsDBManager()

export async function addEvent(req: Request, res: Response, next: NextFunction) {
  try {
    const {title, description, datetime} = req.body
    const datetimeObj = new Date(datetime)
    let isUrgent = false

    if (!title) throw Error('User must insert title')

    if (datetimeObj.getTime() < new Date().getTime())
      throw Error('Cannot add events that occur in the past')

    const result = await eventsDB.addEvent(title, description, datetimeObj)

    if (datetimeObj.getTime() - new Date().getTime() < 5*60*1000)
      isUrgent = true

    res.status(200).send({isUrgent, result})
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
