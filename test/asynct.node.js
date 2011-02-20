//asynct.node.js

//simple async test adapter

var helper = require('./lib/helper')
  , it = require('it-is')
  , isPass = helper.isPass
  , isError = helper.isError
  , isFail = helper.isFail

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

var asynct = require('../adapters/asynct')
  , Report = require('../report')
  
exports ['pass'] = function (finish){

  var reporter = new Report('pass')
    , shutdown = 
      asynct.run({
       'pass1': helper.try(function (test){
          process.nextTick(test.finish)
        },500)
      },reporter)

  setTimeout(done,200)

  function done(){
    shutdown()
    check
    ( reporter.report, 'pass','success',
      [ isPass('pass1') ] )

    finish()  
  }
}


exports ['error'] = function (finish){
  var reporter = new Report('error')
    , shutdown = 
      asynct.run({
       'error1': helper.try(function (test){
      //  try{
          setTimeout(
          //process.nextTick(
          function (){
          console.log("throw!")

          throw new Error ("ASYNC ERROR") },0)
  //        }catch (error){
//            throw "ERROR THREW SYNC!!!"
    //      }
        },500)
      },reporter)

  setTimeout(done,200)

  function done(err,report){
    shutdown()
    check
    ( reporter.report, 'error','error',
      [ isError('error1',{message: "ASYNC ERROR"}) ] )

    finish()  
  }
}


exports ['failure'] = function (finish){
  var reporter = new Report('failure')
    , shutdown = 

  asynct.run({
   'fail1': helper.try(function (test){
      setTimeout(function (){ it(0).equal(1) },0)
    },500)
  },reporter)

  setTimeout(done,200)

  function done(){
    it(shutdown).function()
    shutdown()
    check
    ( reporter.report, 'failure','failure',
      [ isFail('fail1') ] )

    finish()  
  }
}


exports ['double finish'] = function (finish){
  var reporter = new Report('double finish')
    , shutdown = 

  asynct.run({
   'badfinish1': helper.try(function (test){
      process.nextTick(test.finish)
      process.nextTick(test.finish)
    },500)
  },reporter)

  setTimeout(done,200)

  function done(){
    check
    ( reporter.report, 'double finish','error',
      [ isError('badfinish1', { message:it.matches(/called finish twice/) } ) ] )

    finish()  
  }
}

/**
  exports ['error then finish'] = function (finish){
  [deleted]

  it's to complicated, and also unnecessary to make an error when finish is called after an error.
  the test already fails, so it's not a false positive, and thats enough.
  
  the most important thing is to avoid false negatives and false positives.
*/

exports ['double error'] = function (finish){
  var reporter = new Report('double error')
    , finished = false
    , shutdown = 

  asynct.run({
   'badfinish3': helper.try(function (test){
      process.nextTick(function (){throw new Error("FIRST ERROR")})
      process.nextTick(function (){throw new Error("SEOND ERROR")})
    },200)
  },reporter) 

  setTimeout(helper.try(done),300)

  function done(){
    shutdown()
    console.log("DONE")
    check
    ( reporter.report, 'double error','error',
      [ isError('badfinish3', { message:"FIRST ERROR" }, { message:"SECOND ERROR" } ) ] )

    it(finished).equal(false)

    finished = true

    finish()  
  }
}

/*
exports ['finish then error'] = function (finish){
  var reporter = new Report('finish then error')
    , finished = false
    , shutdown = 

  asynct.run({
   'badfinish4': helper.try(function (test){
      process.nextTick(test.finish)
      process.nextTick(function (){throw new Error("ERROR AFTER FINISH")})
    },200)
  },reporter)

  setTimeout(helper.try(done),400)

  function done(){
    shutdown()
    console.log("DONE$$$$$$$$$$$$$" + finished)
//    throw 'crazy error'
    if(finished)
      console.log("***********************")
      
    it(finished).equal(false)

    finished = true

    check
    ( reporter.report, 'finish then error','error',
      [ isError('badfinish4', { message:"ERROR AFTER FINISH" } ) ] )

    console.log("CHECKED")


    console.log("finished!")


    console.log("ABOUT TO CALL FINISH")
    finish()  

    console.log("called finish")

  }
}
  //*/

helper.runAsync(exports)
