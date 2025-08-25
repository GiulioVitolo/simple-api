export function validateAndParse(jsDate: string): string {

  const datetimeObj = new Date(jsDate)
  if (datetimeObj.getTime() < new Date().getTime())
      throw Error('Cannot add events that occur in the past')

  datetimeObj.setMinutes(datetimeObj.getMinutes() - datetimeObj.getTimezoneOffset())
  const sqlDatetime = datetimeObj.toISOString().slice(0,19).replace('T', ' ')
  return sqlDatetime
}

export function setNotification(title: string, jsDate: string): number {

  let delay = new Date(jsDate).getTime() - new Date().getTime() // ms
  if (delay > 5 * 60 * 1000) {
    delay = delay - (5 * 60 * 1000)
  }
  setTimeout(() => {
      console.log(`The event '${title}' will start in ${Math.round(delay/(1000 * 60))} minutes`)
    }, delay)

  return delay
}