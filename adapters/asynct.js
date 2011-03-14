//asynct.js

//simple async test adapter

var assert = require('assert')

exports.run = run

function run(tests,reporter){
  var x, testNames, names = testNames = x = Object.keys(tests)
  var currentNext, currentName
  var setupX = /^__?setup$/
    , teardownX = /^__?teardown$/
    , setupAll = null
    , teardownAll = null
    , teardownCalled = false
    , status = {}

  names = names.filter(function (e){
    if(setupX(e))
      setupAll = tests[e]
    else if(teardownX(e))
      teardownAll = tests[e]
    else
      return true
  })

  names.forEach(function (n){
    status[n] = 'not started'
  })

  testNames = [].concat(names)

  Tester.prototype = assert

  function Tester (next,name){
    this.done = next
    this.finish = next
    this.name = name
    this.catch = null
    this.uncaughtExceptionHandler = null
  }
  
//  var inHandler = false
  function handler (error){
    if(currentTester.catch && inHandler == false){
      inHandler = true
      try{
        currentTester.catch (error)
        inHandler = false
        return      
      } catch (err){
        console.log("CAUGHT ERROR IN ERROR HANDLER")
        console.log(err.stack)
        
        error = err //continue to error handling part of this function.
      }
    }

    if(currentName) {
      status[currentName] = 'finished'

      reporter.test(currentName,error)
      console.log('calling next from error handler')
      process.nextTick(currentNext || next)
    } else {
      reporter.error(error)
    }
  }

  process.on('uncaughtException', handler)

  if(setupAll){
    currentName = '__setup'
    setupAll(currentTester = new Tester(next,'__setup'))  
  } else {
    next()
  }

  function callTeardown(){
    if(teardownAll && !teardownCalled){
      teardownCalled = true
      currentName = '__teardown'
      
      teardownAll(currentTester = new Tester(function (){
        /*until node supports async process.exit teardown is async*/
      },'__teardown'))              
    }
  }

  function next(){
    if(!names.length){
      callTeardown()
      return //stop starting tests and wait for shutdown to be called.
    }

    var name = currentName = names.shift()
      , finished = false
      , currentNext = safeNext
      , tester = currentTester = new Tester(safeNext,name)
    reporter.test(name)
    try { 
      status[name] = 'started'
      tests[name](tester) 
    } catch (error){
      handler(error)
    }
    function safeNext(){
      
      if(!finished) {
        status[currentName] = 'finished'

        callTeardown()
        finished = true
        process.nextTick(next)
      } else {
        reporter.test(name,new Error('test \'' + name + '\' called finish twice'))
      }
    }
  }

  return function (){ //return a shutdown function, will be called on exit
    testNames.forEach(function (c){
      if(status[c] == 'not started')
        reporter.test(c,"was not started. (did anmother test not call test.done()?)")
      else if (status[c] == 'started')
        reporter.test(c,"was started, but did not complete. (did anmother test not call test.done()?)")
    })
    process.removeListener('uncaughtException', handler)
  }
}
