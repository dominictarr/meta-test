//asynct.js

//simple async test adapter

var assert = require('assert')

exports.run = run

function run(tests,reporter){
  var names = Object.keys(tests)
  var currentNext, currentName
  
  function handler (error){
    if(currentName) {
      reporter.test(currentName,error)
      process.nextTick(currentNext || next)
    } else {
      reporter.error(error)
    }
  }

  process.on('uncaughtException', handler)

  next()
 
  function next(){
    if(!names.length)
      return //stop starting tests and wait for shutdown to be called.

    var name = currentName = names.shift()
      , finished = false
      , currentNext = safeNext
      , tester = {done: safeNext, finish: safeNext}

    tester.__proto__ = assert

    try{
      reporter.test(name)
      tests[name](tester)
    } catch (error){
      reporter.test(name,error)
      safeNext()
    }
    function safeNext(){
      
      if(!finished) {
        finished = true
        process.nextTick(next)
      } else {
        reporter.test(name,new Error('test \'' + name + '\' called finish twice'))
      }
    }
  }

  return function (){ //return a shutdown function, will be called on exit
      process.removeListener('uncaughtException', handler)
  }
}
