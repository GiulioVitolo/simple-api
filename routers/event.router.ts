import { Router } from "express";
import { addEvent, getEvents, getEvent } from "../controllers/event.controller";

const eventRouter = Router()

eventRouter.post('/', addEvent)
eventRouter.get('/', getEvents)
eventRouter.get('/:id', getEvent)

export default eventRouter