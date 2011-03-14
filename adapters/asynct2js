//asynct.js

//simple async test adapter

var assert = require('assert')
  , ctrl = require('ctrlflow') 
exports.run = run
  console.log("NAMES SDFADASDAS D")

function run (tests,reporter){
  console.log("NAMES SDFADASDAS D")
  var status = {}
  var setup = [], teardown = []
  var names = Object.keys(tests).filter(function (name){
    console.log(name)
    if (/^__?setup$/(name))
      setup.push(name)
    else if (/^__?teardown$/(name))
      teardown.push(name)
    else
      return true
  }
  
  names = setup.concat(names).concat(teardown)
  
  console.log("NAMES SDFADASDAS D")

  console.log(names)
  
  //if there is setup and teardown functions move them to the start end and respectively.
  

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
