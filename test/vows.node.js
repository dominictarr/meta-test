var adapter = require('../adapters/vows')
  , helper = require('./lib/helper')
  , Report = require('../report')
  , vows = require('vows')
  , log = console.log
  , assert = require('assert')
  , it = require('it-is')  
  , simple = require('../examples/test/simple.vows')

/*exports ['simple'] = function (finish){

  var reporter = new Report('passing test')
    , expects = new Report('passing test')
    , shutdown = 
  adapter.run(simple,reporter)
  
  setTimeout(function (){
    shutdown()
    console.log(reporter.report.status,reporter.report)
  },200)
}*/

function vow(name,batch){
  var m = {exports: {}}
    , suite = vows.describe(name)
    suite.addBatch(batch).export(m)
  return m.exports  
}

exports ['pass'] = function (finish){
  var reporter = new Report('passing test')
    , expects = new Report('passing test')
    , ran = false
    , shutdown = 
  adapter.run(vow('passing test',
  { 'the number 7':{
      topic: 7
    , 'should equal 3+4': function (seven){
        ran = true
        assert.equal(seven, 3 + 4)
      }
    }
  }),reporter)

  setTimeout(c,200)
  
  function c(){
    shutdown()

    it(ran).equal(true)

    it(reporter.report).deepEqual(expects.test('the number 7\n  should equal 3+4').report)

    finish()
  }
}
//*/

exports ['fail'] = function (finish){
  var reporter = new Report('failing')
    , expects = new Report('failing')
    , ran = false
    , shutdown = 
  adapter.run(vow('failing',
  { 'prime':{
      topic: 7
    , 'mod 2 == 0': function (seven){
        ran = true
        assert.equal(seven % 2, 0)
      }
    }
  }),reporter)

  setTimeout(c,200)
  
  function c(){
    shutdown()

    it(ran).equal(true)

    it(reporter.report)
      .has(expects.test( 'prime\n  mod 2 == 0', {name: 'AssertionError'}).report)

    finish()
  }
}

exports ['error'] = function (finish){
  var reporter = new Report('error')
    , expects = new Report('error')
    , ran = false
    , shutdown = 
  adapter.run(vow('failing',
  { 'error':{
      topic: 7
    , 'throws': function (seven){
        ran = true
        throw new Error("INTENSIONAL ERROR")

      }
    }
  }),reporter)

  setTimeout(c,200)
  
  function c(){
    shutdown()

    it(ran).equal(true)

    it(reporter.report)
      .has(expects.test( 'error\n  throws', it.typeof('string')).report)

    finish()
  }
}

helper.runAsync(exports)
