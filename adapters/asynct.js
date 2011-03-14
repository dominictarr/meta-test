//asynct.js

//simple async test adapter

var assert = require('assert')
  , ctrl = require('ctrlflow') 
exports.run = run

var isSetup = /^__?setup$/
var isTeardown = /^__?teardown$/
var isSetupTeardown = /^__?(setup|teardown)$/

function run (tests,reporter){
  var status = {}
  var setup = [], teardown = []
  var names = Object.keys(tests).filter(function (name){
    if(isSetup(name))
      setup.push(name)
    else if (isTeardown(name))
      teardown.push(name)
    else return true
  })
  
  names = setup.concat(names).concat(teardown)
  
  console.log(names)
  
  var tests = names.map(function (name){
    var test = tests[name]
    status[name] = 'not started'
    return function (){
      var __next = this.next
        , finishAlready = false

      if(!isSetupTeardown(name)) //don't report setup and teardown unless there is an error.
        reporter.test(name)
        
      function next (){
        status[name] = 'finished'
        if(finishAlready)
          return reporter.test(name,new Error('test \'' + name + '\' called finish twice'))
        finishAlready = true
        __next()
      }
    
      function error(err){
        reporter.test(name,err)
        console.log(err.stack)
        next()
      }

      var tester = new Tester(name,next)

      function handle(err){
        var catcher = tester.catch || tester.uncaughtExceptionHandler
        if('function' == typeof catcher){
          try{
            catcher(err)
          } catch (err){
            error(err)          
          }        
        } else {
          error(err)
        }
      }
      
      process.removeAllListeners('uncaughtException')
      process.on('uncaughtException',handle)
      
      try{ 
        status[name] = 'started'
        test.call(null,tester) 
        if(isTeardown(name))
          next()//teardown is sync! .. 
        //on second thoughts this is probably not a good idea.
        //maybe, by hooking process.nextTick and the events you could have an 
        //event loop drain event, so that you know when the process is about to exit.
      } catch (err) {handle(err)}
    }
  })

  ctrl.seq(tests)()
  
  return function (){
    process.removeAllListeners('uncaughtException')
    
    var unfinished = names.forEach(function (name){
      console.log(status)
      console.log(Object.keys(tests))
        
        if(status[name] != 'finished')
          reporter.test(name, "did not finish, state was: " + status[name])
      })

    
//    process.removeAllListeners('uncaughtException')
  }
  
}

  Tester.prototype = assert

  function Tester (name,next){
    this.done = next
    this.finish = next
    this.name = name
    this.catch = null
    this.uncaughtExceptionHandler = null
  }
