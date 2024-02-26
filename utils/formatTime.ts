export const calcWaitTime = (date:Date) => {
  const currentDate = new Date()

  const timeDifference = date.getTime() - currentDate.getTime()

  // Convert milliseconds to minutes
  const minutesDifference = Math.floor(timeDifference / (1000 * 60))
  return (minutesDifference > 0) ? `${minutesDifference} minutes` : 'now'
}

export const onlyDateTime = (date:Date) => {
  return `${date?.toDateString()} ${date?.toLocaleTimeString()}`
}
