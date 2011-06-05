//asynct.node.js

//simple async test adapter

var helper = require('./lib/helper')
  , it = require('it-is')
  , isPass = helper.isPass
  , isError = helper.isError
  , isFail = helper.isFail
  , asynct = require('../adapters/asynct')
  , Report = require('../report')

/*
  unlike everything else in node, instead of the test adapter being called back when it's finished,
  it gets called and is told to finish.
  
  the reason is because the adapters often need to process something at exit.
  
  since tests will be run in thier own process (to completely sandbox them) this is feasible,
  without waiting for *everything* to exit.

  everything the adapter returns is in the report.
  
  the adapter logs everything to the report, and then when the process is complete, 
  the report is pulled buy runner.
*/

function makeBeforeExit(timeout) {
  timeout = timeout || 400
  var doBefore = function (){}
  
  setTimeout(function (){console.log("de before exit" + timeout); doBefore()},timeout)

  return beforeExit

  function beforeExit(before){
    doBefore = before
  }
}
var assert = require('assert')
function check(report,name,status,tests){
//  console.log('check')
    it(report)
      .has({
        filename: name
      , status: status
      , tests: tests
      })
  console.log('checked')
}

  
exports ['setup pass teardown'] = function (finish){
  var setups = 0
    , teardowns = 0
    , reporter = new Report('pass')
    , shutdown = 
      asynct.run({
       '_setup': helper.try(function (test){
          //called only once
          setups ++
          process.nextTick(test.finish)
        },500)
      ,'_teardown': helper.try(function (test){
        teardowns ++
        //must be sync!
        },500)
      , 'pass1': helper.try(function (test){
          process.nextTick(test.finish)
        },500)
      , 'pass2': helper.try(function (test){
          process.nextTick(test.finish)
        },500)
      },reporter,function (){})

  setTimeout(done,200)

  function done(){
    shutdown()

    check
    ( reporter.report, 'pass','success',
      [ isPass('pass1'), isPass('pass2') ] )

    it(setups).equal(1)
    it(teardowns).equal(1)

    finish()  
  }
}


exports['setup fail error teardown'] = function (finish){
  var setups = 0
    , teardowns = 0
    , reporter = new Report('pass')
    , shutdown = 
      asynct.run({
        '_setup': helper.try(function (test){
          //called only once
          setups ++
          process.nextTick(test.finish)
        },500)
      , '_teardown': helper.try(function afterFailTeardown(test){
          teardowns ++
        },500)
      , 'fail': helper.checkCall(function (test){
            it(0).equal(1)
        },500)
      , 'error': helper.checkCall(function (test){
          throw new Error('INTENSIONAL ERROR')
        },500)
      },reporter,function (){})

  setTimeout(done,200)

  function done(){
    //should call teardown when all tests are finished...
    if(!teardowns)
      helper.crash("expected teardown to have been called already")
    
    shutdown()
    check
    ( reporter.report, 'pass','error',
      [ isFail('fail'), isError('error') ] )

    it(setups).equal(1)

    finish()  
  }
}
//*/

helper.runAsync(exports)
