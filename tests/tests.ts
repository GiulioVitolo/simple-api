import {describe, expect, test} from '@jest/globals'
import EventsDBManager from '../database/db.events.manager'

describe('Get all events', () => {
  test('From empty table', () => {

  })
  test('From full table', () => {

  })
})

describe('Get event by id', () => {
  test('From empty table without a matching id', () => {

  })
  test('From empty table with a matching id', () => {

  })
  test('From full table without a matching id', () => {

  })
  test('From full table with a matching id', () => {

  })  
})

describe('Add event', () => {
  test('Correct body parameters', () => {

  })
  test('Empty title', () => {
    
  })
  test('Empty description', () => {
    
  })
  test('Wrong datetime format', () => {
    
  })
  test('Either parameter missing', () => {
    
  })
})

describe('HTTP GET and POST requests', () => {
  test('GET /events', () => {
    
  })
  test('GET /events/:id', () => {
    
  })
  test('POST /events', () => {
    
  })
})

describe('Notification system', () => {
  test('Event time is in less than 5 minutes', () => {
    
  })
  test('Event time is exactly in 5 minutes', () => {
    
  })
  test('Event time is in more than 5 minutes', () => {
    
  })
})

describe('events.db utils functions', () => {
  test('Validate and parse json datetime to sql datetime', () => {
    
  })
})
