'use strict'

const hypercore = require('hypercore')
const async = require('async')

// january 2017, december 2017, october 2018
const trades = require('./trades-set.json')
const feed = hypercore('./test') // store data in ./directory

function test () {
  const tenBillion = 10000000000
  let count = 0

  async.whilst(
    function () { return count < tenBillion },
    function (cb) {
      const ri = Math.floor(Math.random() * trades.length)
      const entry = trades[ri]

      if (count % 100000 === 0) {
        print()
      }

      feed.append(JSON.stringify(entry), (err) => {
        if (err) return cb(err)
        count++
        cb(null, count)
      })
    },
    function (err, n) {
      if (err) {
        print()

        console.log('error at seq', count)
        console.log(err)
        process.exit(1)
      }

      print()
      console.log('finished sucessfully.')
      process.exit(0)
    }
  )
}

function print () {
  const cM = process.memoryUsage()
  const cC = process.cpuUsage()
  console.log('cM', JSON.stringify(cM))
  console.log('cC', JSON.stringify(cC))
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
