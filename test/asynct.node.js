//asynct.node.js

//simple async test adapter

var helper = require('./lib/helper')
  , it = require('it-is')
  , isPass = helper.isPass
  , isError = helper.isError
  , isFail = helper.isFail
  , assert = require('assert')
  , asynct = require('../adapters/asynct')
  , Report = require('../report')

// require('long-stack-traces/lib/long-stack-traces')
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
function check(report,name,status,tests){
//  console.log('check')
    it(report)
      .has({
        filename: name
      , status: status
      , tests: tests
      })
}

  
exports ['pass'] = function (finish){

  var reporter = new Report('pass')
    , shutdown = 
      asynct.run({
       /*'pass1': function (test){
          process.nextTick(test.finish)
        }*/
       'pass1': helper.try(function (test){
//        console.log(test.finish.toString())
          process.nextTick(test.finish)
        },500)
      },reporter, helper.checkCall(function (){},200))

  setTimeout(done,200)

  function done(){
    shutdown()
    console.log('checking...')
    check
    ( reporter.report, 'pass','success',
      [ isPass('pass1') ] )
    console.log('checked!...')

    finish()  
  }
}

exports ['error'] = function (finish){
  var reporter = new Report('error')
    , shutdown = 
      asynct.run({
       'error1': helper.try(function (test){
          setTimeout(function (){
            console.log("throw!")

            throw new Error ("ASYNC ERROR") 
          },0)
        },500)
      },reporter, helper.checkCall(function (){},200))

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
    'fail async': helper.checkCall(function (test){
      setTimeout(function (){ it(0).equal('async') },0)
    },500)
  , 'fail sync': helper.checkCall(function (test){
      it(0).equal('sync')
    },500)
  },reporter, helper.checkCall(function (){},200))

  setTimeout(done,200)

  function done(){
    it(shutdown).function()
    shutdown()
    check
    ( reporter.report, 'failure','failure',
      [ isFail('fail async'), isFail('fail sync') ] )

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
  },reporter, helper.checkCall(function (){},200))

  setTimeout(helper.try(done),200)

  function done(){
    shutdown()
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
  },reporter, helper.checkCall(function (){},200)) 

  setTimeout(helper.try(done),300)

  function done(){
    shutdown()
    check
    ( reporter.report, 'double error','error',
      [ isError('badfinish3', { message:"FIRST ERROR" }, { message:"SECOND ERROR" } ) ] )

    it(finished).equal(false)

    finished = true

    finish()  
  }
}

exports ['error if tests not executed'] = function (finish){
  var reporter = new Report('error if tests not executed')
    , finished = false
    , shutdown = 
  asynct.run({
    'pass': helper.try(function (test){
      test.done()
    },200)
  , 'not called 1': function (test){
    }
  , 'not called 2': function (test){
    }
  },reporter, function(){})//the tests will not finish so it won't callback. 

  setTimeout(helper.try(done),300)

  function done(){
    shutdown()

    check
    ( reporter.report, 'error if tests not executed','error',
      [ isPass('pass'), isError('not called 1'), isError('not called 2') ] )

    finish()  
  }
}
//*/
/*
asynct is getting messy. time for a rewrite.

*/

exports ['user can catch async errors'] = function (finish){
  var reporter = new Report('user catch')
    , error = new Error ("INTENSIONAL ERROR for user catch")
    , caught1 = false,caught2 = false,caught3 = false
    , shutdown = 
  asynct.run({
    'user catch': function (test){

     test.catch = function (err){
      console.log("handling:" + err.message)
        if(caught1)
          helper.crash(new Error("Error handler should have only been called once:" + err.stack).stack)
        caught1 = true
        it(err).equal(error)
        test.done()
      }
        throw error
    },
    'user catch async': function (test){

     test.catch = function (err){
      console.log("handling:" + err.message)
        if(caught2)
          helper.crash(new Error("Error handler should have only been called once:" + err.stack).stack)
        caught2 = true
        it(err).equal(error)
        test.done()
      }
      
      process.nextTick(function (){
        throw error
      })
    },
    'user catch error': function (test){

      test.catch = function (err){
        if(caught3)
          helper.crash(new Error("Error handler should have only been called once:" + err.stack).stack)
        caught3 = true
        throw new Error("INTENSIONAL ERROR 2")
        
      }      
      process.nextTick(function (){
        throw error
      })
    }
  },reporter, helper.checkCall(function (){},200)) 

  setTimeout(helper.try(done),300)

  function done(){
    shutdown()
    console.log(reporter.report)
    check
    ( reporter.report, 'user catch','error',
      [ isPass('user catch')
      , isPass('user catch async')
      , isError('user catch error', {message: "INTENSIONAL ERROR 2"}) 
      ] )
    it(caught1).ok()
    finish()  
  }
}

exports ['user can catch async errors - with async_testing api'] = function (finish){
  var reporter = new Report('user catch')
    , error = new Error ("INTENSIONAL ERROR for user catch")
    , caught1 = false,caught2 = false,caught3 = false
    , shutdown = 
  asynct.run({
    'user catch': function (test){

     test.uncaughtExceptionHandler = function (err){
      console.log("handling:" + err.message)
        if(caught1)
          helper.crash(new Error("Error handler should have only been called once:" + err.stack).stack)
        caught1 = true
        it(err).equal(error)
        test.done()
      }
        throw error
    },
    'user catch async': function (test){

     test.uncaughtExceptionHandler = function (err){
      console.log("handling:" + err.message)
        if(caught2)
          helper.crash(new Error("Error handler should have only been called once:" + err.stack).stack)
        caught2 = true
        it(err).equal(error)
        test.done()
      }
      
      process.nextTick(function (){
        throw error
      })
    },
    'user catch error': function (test){

      test.uncaughtExceptionHandler = function (err){
        if(caught3)
          helper.crash(new Error("Error handler should have only been called once:" + err.stack).stack)
        caught3 = true
        throw new Error("INTENSIONAL ERROR 2")
        
      }      
      process.nextTick(function (){
        throw error
      })
    }
  },reporter, helper.checkCall(function (){},200)) 

  setTimeout(helper.try(done),300)

  function done(){
    shutdown()
    console.log(reporter.report)
    check
    ( reporter.report, 'user catch','error',
      [ isPass('user catch')
      , isPass('user catch async')
      , isError('user catch error', {message: "INTENSIONAL ERROR 2"}) 
      ] )
    it(caught1).ok()
    finish()  
  }
}

/*
.error , .failure method to log an error without throwing it.
useful for get errors through to the report when testing servers and things that just keeps on going.
*/

exports ['log error/failure'] = function (finish){
  var reporter = new Report('logged error')
    , shutdown = 
      asynct.run({
       'error1': helper.try(function (test){
          setTimeout(function (){
            console.log("throw!")

            test.failure(new Error ("SYNC ERROR"))
            process.nextTick(function (){
              test.error(new Error ("ASYNC ERROR2"))
              test.done()
            })
          },0)
        },500)
      },reporter)

  setTimeout(done,200)

  function done(err,report){
    shutdown()
    check
    ( reporter.report, 'logged error','error',
      [ isError('error1',[{message: "SYNC ERROR"},{message: "ASYNC ERROR2"}]) ] ) 

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
