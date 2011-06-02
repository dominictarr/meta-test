var adapter = require('../adapters/nodeunit')
  , helper = require('./lib/helper')
  , Report = require('../report')
  , log = console.log
  , assert = require('assert')
  , it = require('it-is')  

/*
make async failing test.

asynct is failing for async tests in 0.2.0, why?
*/

exports ['pass'] = function (finish){
  var reporter = new Report('passing test')
    , expects = new Report('passing test')
    , ran = false
    , shutdown = 
  adapter.run({
    'pass1': function (test){
      test.done()
    }
  , 'pass2': function (test){
      test.done()
    }
  },reporter,helper.checkCall(function (){},200))

  setTimeout(done,200)
  
  function done(){
    shutdown()

    it(reporter.report).deepEqual(expects.test('pass1').test('pass2').report)

    finish()
  }
}

exports ['error'] = function (finish){
  var reporter = new Report('erroring test')
    , expects = new Report('erroring test')
    , ran = false
    , shutdown = 
  adapter.run({
    'error1': function (test){
      throw new Error("INTENSIONAL ERROR 1")
      test.done()
    }
  },reporter,helper.checkCall(function (){},200))

  setTimeout(done,200)
  
  function done(){
    shutdown()

    it(reporter.report)
      .has(
        expects
          .test('error1', {message: "INTENSIONAL ERROR 1"})
          .report)

    finish()
  }
}

exports ['fail'] = function (finish){
  var reporter = new Report('failing test')
    , expects = new Report('failing test')
    , ran = false
    , shutdown = 
  adapter.run({
    'fail1': function (test){
      test.ok(false)
      test.done()
    },
    'fail2': function (test){
      test.ok(false, "not OK 1")
      test.ok(false, "not OK 2")
      test.done()
    }
  },reporter,helper.checkCall(function (){},200))

  setTimeout(done,200)
  
  function done(){
    shutdown()

    it(reporter.report)
      .has(
        expects
          .test('fail1', {name: "AssertionError"})
          .test('fail2', {name: "AssertionError", message: "not OK 1" })
          .test('fail2', {name: "AssertionError", message: "not OK 2" })
          .report)

    finish()
  }
}

exports ['did not call done'] = function (finish){
  var reporter = new Report('unfinishing test')
    , expects = new Report('unfinishing test')
    , ran = false
    , shutdown = 
  adapter.run({
    'unfinished1': function (test){
//      test.ok(false)
    },
    'unfinished2': function (test){
      //second test will never be called if first does not finish
      test.ok(false, "not OK 1")
      test.ok(false, "not OK 2")
    },
/*    'fail2': function (test){
      test.ok(false, "not OK 1")
      test.ok(false, "not OK 2")
      test.done()
    }*/
  },reporter,function (){})

  setTimeout(done,200)
  
  function done(){
    shutdown()

    it(reporter.report)
      .has(
        expects
          .test('unfinished1', {message: it.matches(/did not call test.done/)})
          //will not be called if first test does not call test.done()
/*          .test('unfinished2', {name: "AssertionError", message: "not OK 1" })
          .test('unfinished2', {name: "AssertionError", message: "not OK 2" })
          .test('unfinished2', {message: it.matches(/did not call test.done/)})*/
          .report)

    finish()
  }
}

exports ['did not call done2'] = function (finish){
  var reporter = new Report('unfinishing test')
    , expects = new Report('unfinishing test')
    , ran = false
    , shutdown = 
  adapter.run({
    'unfinished2': function (test){
      //second test will never be called if first does not finish
      test.ok(false, "not OK 1")
      test.ok(false, "not OK 2")
    }
  },reporter,function (){})

  setTimeout(done,200)
  
  function done(){
    shutdown()

    it(reporter.report)
      .has(
        expects
          .test('unfinished2', {name: "AssertionError", message: "not OK 1" })
          .test('unfinished2', {name: "AssertionError", message: "not OK 2" })
          .test('unfinished2', {message: it.matches(/did not call test.done/)})
          .report)

    finish()
  }
}

helper.runAsync(exports)
