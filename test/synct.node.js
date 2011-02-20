//sync.expresso.js
var it = require('it-is')
  , synct = require('../adapters/synct')
  , Report = require('../report')
  , helper = require('./lib/helper')
  , isPass = helper.isPass
  , isError = helper.isError
  , isFail = helper.isFail

exports ['sync pass'] = function (){
  var reporter = new Report('sync pass')
    , shutdown = 
    
  synct.run({
    'pass': function (){}
  },reporter)
  
  shutdown()

  it(reporter.report)
    .has({
      filename: 'sync pass'
    , status: 'success'
    , tests: it.has([ isPass('pass') ] )
    })
}


exports ['sync error'] = function (){
  var reporter = new Report('sync error')
    , shutdown = 
    
  synct.run({
    'error': function (){ throw new Error ("INTENSIONSAL ERROR")}
  },reporter)
  
  shutdown()

  it(reporter.report)
    .has({
      filename: 'sync error'
    , status: 'error'
    , tests: it.has( [ isError('error', { message: "INTENSIONSAL ERROR" } ) ] )
    })
}

exports ['sync fail'] = function (){
  var reporter = new Report('sync fail')
    , shutdown = 
    
  synct.run({
    'fail': function (assert){ assert.ok(false)}
  },reporter)
  
  shutdown()

  it(reporter.report)
    .has({
      filename: 'sync fail'
    , status: 'failure'
    , tests: it.has([ isFail('fail') ])
    })
}

exports ['weird throws'] = function (){
  var reporter = new Report('weird throws')
    , shutdown = 
    
  synct.run({
    'string':     function (assert) { throw 'string'  },
    'number':     function (assert) { throw 7 },
    'null':       function (assert) { throw null  },
    'false':      function (assert) { throw false },
    'undefined':  function (assert) { throw undefined },
    'function':   function (assert) { throw function (){} },
  },reporter)
  
  shutdown()

  it(reporter.report)
    .has({
      filename: 'weird throws'
    , status: 'error'
    , tests: it.has([ 
        isError('string','string')
      , isError('number',7)
      , isError('null',it.equal(null))
      , isError('false',it.equal(false))
      , isError('undefined').has({failures:it.deepEqual([undefined])})
      , isError('function',it.function())
      ])
    })
}

helper.runSync(exports)
