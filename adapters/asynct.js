//asynct.js

//simple async test adapter

var assert = require('assert')

exports.run = run

function run(tests,reporter){
  var x, names = x = Object.keys(tests)
  var currentNext, currentName
  var setupX = /^__?setup$/
    , teardownX = /^__?teardown$/
    , setupAll = null
    , teardownAll = null

  names = names.filter(function (e){
    if(setupX(e))
      setupAll = tests[e]
    else if(teardownX(e))
      teardownAll = tests[e]
    else
      return true
  })

  Tester.prototype = assert
  function Tester (next,name){
    this.done = next
    this.finish = next
    this.name = name
  }

  function handler (error){
    if(currentName) {
      reporter.test(currentName,error)
      process.nextTick(currentNext || next)
    } else {
      reporter.error(error)
    }
  }

  process.on('uncaughtException', handler)

  if(setupAll){
    currentName = '__setup'
    setupAll(new Tester(next,'__setup'))  
  } else {
    next()
  }
  function next(){
    if(!names.length){
//      console.log('wait for exit')
      return //stop starting tests and wait for shutdown to be called.
    }
    console.log(names)
    var name = currentName = names.shift()
      , finished = false
      , currentNext = safeNext
      , tester = new Tester(safeNext,name)
    reporter.test(name)
    try { 
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
      if(teardownAll){
        currentName = '__teardown'
        teardownAll(new Tester(function (){
          /*until node supports async process.exit teardown is async*/
        },'__teardown'))              
      }
        
      process.removeListener('uncaughtException', handler)
  }
}
