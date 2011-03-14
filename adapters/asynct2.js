//asynct.js

//simple async test adapter

var assert = require('assert')
  , ctrl = require('ctrlflow') 
exports.run = run

function run (tests,reporter){
  var status = {}
  var names = Object.keys(tests)
  var tests = names.map(function (name){
    var test = tests[name]
    status[name] = 'not started'
    return function (){
      var __next = this.next
        , finishAlready = false

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
        if('function' == typeof tester.catch){
          try{
            tester.catch(err)
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
