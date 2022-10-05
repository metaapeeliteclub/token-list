let stopwatch
let currentMinute = 0

// Current minute logger
function startStopwatch() {
  stopStopwatch()
  stopwatch = setInterval(() => {
    currentMinute++
    console.log('----------> Minute', currentMinute)
  }, 1000 * 60)
}
function stopStopwatch() {
  if (stopwatch) clearInterval(stopwatch)
}

// Pad generator for keeping logs neat
const pad = (input, max) => {
  const inputStr = String(input),
        maxStr = String(max)

  return new Array(maxStr.length - inputStr.length)
    .fill(' ')
    .join('')
}

// Method to create an async timeout
const timeout = (ms) => new Promise((r) => setTimeout(r, ms))

const asyncForEach = async (items, cb) => {
  let cur = 0
  while (cur < items.length) {
    await cb(items[cur], cur)
    cur++
  }
} 

module.exports = {
  startStopwatch,
  stopStopwatch,
  pad,
  timeout,
  asyncForEach,
}
