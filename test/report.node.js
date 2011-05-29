//report.expresso.js

var it = require('it-is')
  , Report = require('../report')
  , helper = require('./lib/helper')
  , test = module.exports
  , assert = require('assert')
//  , log = console.log

test ['a Report'] = function (){

  it(Report(__filename))
    .has({
      report: it.complex()
    , test: it.function()
    })
  var r = Report(__filename)
  
  assert.equal('object', typeof r.report)
  assert.equal('function', typeof r.test)
}

test ['a Report with a pass'] = function (){

  var r = Report(__filename)
  
  r.test('pass')
  
  it(r.report)
    .has({
      name: __filename
    , tests: [ {name: 'pass', failures: [] } ]
    })
}

test ['a Report with an several errors'] = function (){

  var r = Report(__filename)
    , err = new Error("EXAMPLE ERROR")
    , err2 = new Error("EXAMPLE ERROR")
  r.test('error', err)
  r.test('error', err2)
  
  it(r.report)
    .has({
      name: __filename
    , tests: [ {name: 'error', failures: [it.equal(err),it.equal(err2)] } ]
    })
}

test ['a Report with status'] = function (){

  var r = Report(__filename)
    , err = new Error("EXAMPLE ERROR")
    , ass = new assert.AssertionError ({message: "EXAMPLE ASSERTION ERROR"})

  r.test('error', err)
  r.test('fail', ass)
  r.test('pass')
  
  it(r.report)
    .has({
      name: __filename
    , tests: [ 
        { name: 'error'
        , failures: [it.equal(err)]
        , status: Report.status.error }
      , { name: 'fail'
        , failures: [it.equal(ass)]
        , status: Report.status.failure }
      , { name: 'pass'
        , failures: it.deepEqual([])
        , status: Report.status.success }
      ]
    , status: Report.status.error
    })
}

test ['a Report with a global error'] = function (){
  var r = Report(__filename)
    , err = new Error("EXAMPLE ERROR")

  r.error(err)

  it(r.report)
    .has({
      name: __filename
    , tests: it.deepEqual([])
    , failures: [it.equal(err)]
    , status: Report.status.error
    })
}
test ['a Report with a global string error'] = function (){
  var r = Report(__filename)
    , err = "A STRING ERROR, STD ERR DUMP (FOR EXAMPLE)"

  r.error(err)

  it(r.report)
    .has({
      name: __filename
    , tests: it.deepEqual([])
    , failures: [it.equal(err)]
    , status: Report.status.error
    })
}
test ['any thrown non AssertionError it an error status'] = function (){
  var errors = [[], new Error, "hello", false, 324, undefined, null]
  
  it(errors)
    .every(function (actual){

      r = Report(__filename)
      r.error(actual)
      it(r.report.status).equal(Report.status.error)

    })
    .every(function (actual){
    
      r = Report(__filename)
      r.test("test",actual)
      it(r.report.status).equal(Report.status.error)

    })

}


test ['a Report with a global string error'] = function (){
  var r = Report(__filename)
    , err = undefined

  r.error(err)

  it(r.report)
    .has({
      name: __filename
    , tests: it.deepEqual([])
    , failures: it.deepEqual([undefined])
    , status: Report.status.error
    })
}

test ['a Report with a global AssertionError'] = function (){
  var r = Report(__filename)
    , err = undefined
    , ass = new assert.AssertionError ({message: "EXAMPLE ASSERTION ERROR"})

  r.error(ass)

  it(r.report)
    .has({
      name: __filename
    , tests: it.deepEqual([])
    , failures: it.deepEqual([ass])
    , status: Report.status.failure
    })
}


test ['test functions are chainable'] = function (){

 var r = Report(__filename)
 
 it(r.test('name')).equal(r)
 it(r.error("ERROR")).equal(r)

}

test ['can call .test() only adds error if called with 2 args' ] = function (){

 var r = Report(__filename)
   , s = Report(__filename)
 
 it(r.test('name').test('name').report).deepEqual(s.test('name').report)
  
}

test ['add metadata' ] = function (){

 var r = Report(__filename)
   , s = Report(__filename)
 
 it(r.meta('returnThit','value')).equal(r)//return thit so it's chainable.
 
 it(r.report).has({meta:{'returnThit': 'value'}})
  
}

//for(var i in test)
//  test[i]()

helper.runSync(test)
