'use strict'

const hypercore = require('hypercore')
const async = require('async')
const os = require('os')

// january 2017, december 2017, october 2018
const trades = require('./trades-set.json')
const feed = hypercore('./test') // store data in ./directory

let last
function test () {
  console.log(`[info] nodejs@${process.version}`)
  const started = last = Date.now()
  const tenBillion = 10000000000
  let count = 0

  async.whilst(
    function () { return count < tenBillion },
    function (cb) {
      const ri = Math.floor(Math.random() * trades.length)
      const entry = trades[ri]

      if (count % 50000000 === 0) {
        print()
      }

      feed.append(JSON.stringify(entry), (err) => {
        if (err) return cb(err)
        count++
        cb(null, count)
      })
    },
    function (err, n) {
      const ended = Date.now()

      const diff = ended - started
      console.log('[info] started:', started, 'ended', ended)
      console.log('[info] ran fo ', diff, 'ms')

      if (err) {
        print()

        console.log('[info] error at seq', count)
        console.log(err)
        process.exit(1)
      }

      print()
      console.log('[info] finished sucessfully.')
      process.exit(0)
    }
  )
}

function print () {
  const n = Date.now()
  const diff = n - last

  const cM = process.memoryUsage()
  const cC = process.cpuUsage()
  const lA = os.loadavg()

  console.log(n, diff, JSON.stringify(lA))
  console.log(n, diff, JSON.stringify(cM))
  console.log(n, diff, JSON.stringify(cC))

  last = Date.now()
}
/*
function printStats () {
  print()

  function _printStats () {
    setTimeout(() => {
      print()

      _printStats()
    }, 1000 * 60 * 5)
  }

  _printStats()
}
*/
test()
