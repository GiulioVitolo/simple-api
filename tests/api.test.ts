import {afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, jest, test} from '@jest/globals'
import EventsDBManager from '../database/db.events.manager'
import { validateAndParse, setNotification } from '../utils/utils.db.events'
import { addEvent, getEvent, getEvents } from '../controllers/event.controller';
import EventRepository from '../database/event.repository';

describe("event.controller: addEvent", () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  const NOW = new Date("2025-08-25T00:00:00");

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(NOW);

    req = {
      body: {
        title: "Test",
        description: "Desc",
        datetime: "2025-08-25T12:00:00",
      },
    };
    res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    next = jest.fn();

    jest.spyOn(EventRepository.prototype, "addEvent")
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  test("ok response when body is valid", async () => {
    await addEvent(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("error when title is empty or missing", async () => {
    req.body.title = "";
    await addEvent(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));

    delete req.body.title;
    await addEvent(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  test("error when description is empty or missing", async () => {
    req.body.description = "";
    await addEvent(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));

    delete req.body.description;
    await addEvent(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  test("error when datetime is in the past or empty", async () => {
    req.body.datetime = "2024-01-01T00:00:00";
    await addEvent(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));

    req.body.datetime = "";
    await addEvent(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  test("error when datetime has wrong format or missing", async () => {
    req.body.datetime = "25-08-2025 12:00";
    await addEvent(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));

    delete req.body.datetime;
    await addEvent(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

});

describe("event.controller: getEvents", () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    req = {};
    res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    next = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks(); 
  });

  test("ok response if db has n >= 1 elements", async () => {
    jest.spyOn(EventRepository.prototype, "getEvents").mockResolvedValue([{ eventId: 1, title: "T", description: "D", datetime: "2025-08-25 12:00:00" }]);
    await getEvents(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith([{ eventId: 1, title: "T", description: "D", datetime: "2025-08-25 12:00:00" }]);
  });

  test("ok response if db has 0 elements", async () => {
    jest.spyOn(EventRepository.prototype, "getEvents").mockResolvedValue([]);
    await getEvents(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith([]);
  });

  test("calls next(err) if getEvents throws error", async () => {
    jest.spyOn(EventRepository.prototype, "getEvents").mockRejectedValue(new Error());
    await getEvents(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe("event.controller: getEvent", () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    req = { params: { id: "42" } };
    res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    next = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks(); 
  });

  test("ok response if event is present in db", async () => {
    jest.spyOn(EventRepository.prototype, "getEvent").mockResolvedValue({ eventId: 42, title: "T", description: "D", datetime: "2025-08-25 12:00:00" });
    await getEvent(req, res, next);
    expect(EventRepository.prototype.getEvent).toHaveBeenCalledWith(42);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ eventId: 42, title: "T", description: "D", datetime: "2025-08-25 12:00:00" });
  });

  test("calls next(err) if getEvent fails", async () => {
    jest.spyOn(EventRepository.prototype, "getEvent").mockRejectedValue(new Error());
    await getEvent(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('events.db utils functions', () => {
  const NOW = new Date("2025-08-25T00:00:00");

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(NOW);
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test('Validate and parse json datetime to sql datetime', () => {
    expect(validateAndParse('2025-08-25T00:00:00')).toBe('2025-08-25 00:00:00')
  })

  test("validateAndParse: rejects past datetimes", () => {
    expect(() => validateAndParse("2025-08-24T23:59:59"))
      .toThrow("Cannot add events that occur in the past");
  });

  test("setNotification > 5 min ahead", () => {
    expect(setNotification("Title", "2025-08-25T00:06:00")).toBe(60_000);
  });

  test("setNotification ≤ 5 min ahead", () => {
    expect(setNotification("Soon", "2025-08-25T00:04:00")).toBe(4 * 60_000);
  });
})


describe("EventsDBManager", () => {
  let dbm: EventsDBManager;
  let eR: EventRepository;

  beforeAll(async () => {
    dbm = new EventsDBManager(":memory:"); // fast, isolated in-memory DB
    await dbm.createTable();
    eR = new EventRepository(dbm.getDb());
  });

  beforeEach(() => {
    dbm.db.run("DELETE FROM events")
  });

  afterAll(() => {
      dbm.db.close()
  });

  test("run create query", async () => {
    await expect(dbm.createTable()).resolves.toBeDefined();
  });

  test("addEvent and getEvents returns inserted row", async () => {
    await eR.addEvent("Title A", "Desc A", "2025-08-25 12:00:00");
    const rows = (await eR.getEvents()) as any[];
    expect(Array.isArray(rows)).toBe(true);
    expect(rows.length).toBe(1);
    expect(rows[0]).toMatchObject({
      title: "Title A",
      description: "Desc A",
      datetime: "2025-08-25 12:00:00",
    });
  });

  test("getEvent returns the specific row by id", async () => {
    await eR.addEvent("T", "D", "2025-08-25 12:00:00");
    const all = (await eR.getEvents()) as any[];
    const id = all[0].eventId as number;

    const row = (await eR.getEvent(id)) as any;
    expect(row.eventId).toBe(id);
    expect(row.title).toBe("T");
  });

  test("getEvent rejects for missing id", async () => {
    await expect(eR.getEvent(9_999_999)).rejects.toBeNull();
  });

  test("multiple inserts and multiple gets", async () => {
    await eR.addEvent("A", "a", "2025-08-25 10:00:00");
    await eR.addEvent("B", "b", "2025-08-25 11:00:00");
    const rows = (await eR.getEvents()) as any[];
    expect(rows.map((r) => r.title)).toEqual(["A", "B"]);
  });
});
