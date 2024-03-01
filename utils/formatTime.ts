export const calcWaitTime = (date:Date) => {
  const currentDate = new Date()

  const timeDifference = date.getTime() - currentDate.getTime()

  // Convert milliseconds to minutes
  const minutesToWait = Math.floor(timeDifference / (1000 * 60))
  if (minutesToWait <= 0) { return 'now' }
  return (minutesToWait > 59) ? `${parseInt(minutesToWait / 60)} hours` : `${minutesToWait} minutes`
}

export const onlyDateTime = (date:Date) => {
  return `${date?.toDateString()} ${date?.toLocaleTimeString()}`
}
