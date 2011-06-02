//expresso.node.js

//test adapters/expresso

/*
  this is sticky business because expresso does not export an API, 
  and it's interfaces changes between some versions.
  
  (when i first started using expresso it was at 6.2 and my tests don't run on it any more)
  
  haha! i've fixed it though, and this adapter is compatible with tests written for 6.2 and 7+
*/


var adapter = require('../adapters/expresso')
  , helper = require('./lib/helper')
  , Report = require('../report')
  , log = console.log
  , assert = require('assert')
  , it = require('it-is')  

exports ['pass'] = function (finish){
  var reporter = new Report('passing test')
    , expects = new Report('passing test')
    , ran = false
    , shutdown = 
  adapter.run({
    'pass': function (){
      ran = true
    }
  },reporter,helper.checkCall(function (){},200))

  shutdown()

  it(ran).equal(true)

  log(reporter.report)

  it(reporter.report).deepEqual(expects.test('pass').report)

  finish()

}

exports ['fail'] = function (finish){
  var reporter = new Report('failing test')
    , expects = new Report('failing test')
    , shutdown = 

  adapter.run({
    'fail': function (){
      assert.ok(false,"INTENSIONAL FAIL")
    }
  },reporter,helper.checkCall(function (){},200))

  shutdown()

  it(reporter.report)
    .has
    ( expects
      .test('fail', {name: "AssertionError", message: "INTENSIONAL FAIL"})
      .report )

  finish()

}

//*/

exports ['error'] = helper.try(function (finish){
  var reporter = new Report('error test')
    , expects = new Report('error test')
    , shutdown = 

  adapter.run({
    'error': function (){
      throw new Error("INTENSIONAL ERROR")
    }
  },reporter,helper.checkCall(function (){},200))

  shutdown()

  it(reporter.report)
    .has
    ( expects
      .test('error', {message: "INTENSIONAL ERROR"})
      .report)

  finish()

})

exports ['all'] = helper.try(function (finish){
  var reporter = new Report('all test')
    , expects = new Report('all test')
    , shutdown = 

  adapter.run({
    'pass' : function () { }
  , 'fail' : function () { assert.ok(false,"INTENSIONAL FAIL") }
  , 'error': function () { throw new Error("INTENSIONAL ERROR") }
  } , reporter,helper.checkCall(function (){},200))

  shutdown()

  it(reporter.report)
    .has
    ( expects
      .test('pass')
      .test('fail',  {name: "AssertionError", message: "INTENSIONAL FAIL"})
      .test('error', {message: "INTENSIONAL ERROR"})
      .report )

  finish()

})


exports ['compatible with old and new expresso API'] = helper.try(function (finish){
  var reporter = new Report('all test')
    , expects = new Report('all test')
    , shutdown = 

  adapter.run({
    'old' : function (test,before) { 

      it(test).has({
        ok            : it.function ()
      , equal         : it.function ()
      , notEqual      : it.function ()
      , strictEqual   : it.function ()
      , notStrictEqual: it.function ()
      , deepEqual     : it.function ()
      , notDeepEqual  : it.function ()
      , fail          : it.function ()
      , ifError       : it.function ()
      })
      
      it(before).function()
    }
  , 'new' : function (before) { 
      it(before).function()
          
  }
  } , reporter,helper.checkCall(function (){},200))

  shutdown()

  it(reporter.report)
    .has
    ( expects
      .test('old')
      .test('new')
      .report )

  finish()

})

//*/
helper.runAsync(exports)
