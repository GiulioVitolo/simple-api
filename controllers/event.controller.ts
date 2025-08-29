import { Request, Response, NextFunction } from "express";
import { validateAndParse, setNotification } from "../utils/utils.db.events";
import { eventRepository as eR } from '../database/db.context'; // reuse the one instance

export async function addEvent(req: Request, res: Response, next: NextFunction) {
  try {
    const {title, description, datetime} = req.body
    console.log(title)
    const sqlDatetime = validateAndParse(datetime)

    if (!title) throw Error('User must insert title')
    if (!description) throw Error('User must insert description')
    if (!datetime) throw Error('User must insert datetime')

    const result = await eR.addEvent(title, description, sqlDatetime)

    setNotification(title, datetime)

    res.status(200).send(result)
  } catch (err) {
    next(err)
  }
}

export async function getEvents(req: Request, res: Response, next: NextFunction) {
  try {
    const events = await eR.getEvents()
    res.status(200).send(events)
  } catch (err) {
    next(err)
  }
}

export async function getEvent(req: Request, res: Response, next: NextFunction) {
  try {
    const event = await eR.getEvent(Number(req.params.id))
    res.status(200).send(event)
  } catch (err) {
    next(err)
  }
}
