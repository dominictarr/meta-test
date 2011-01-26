//report.expresso.js

var it, is = it = require('it-is')
  , Report = require('../report')
  , assert = require('assert')
  , helper = require('../helper')
  , test = module.exports
  , log = require('logger')

test ['a Report'] = function (){

  it(Report(__filename))
    .has({
      report: is.complex()
    , test: is.function()
    })
}

test ['a Report with a pass'] = function (){

  var r = Report(__filename)
  
  r.test('pass')
  
  it(r.report)
    .has({
      filename: __filename
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
      filename: __filename
    , tests: [ {name: 'error', failures: [is.equal(err),is.equal(err2)] } ]
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
      filename: __filename
    , tests: [ 
        { name: 'error'
        , failures: [is.equal(err)]
        , status: Report.status.error }
      , { name: 'fail'
        , failures: [is.equal(ass)]
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
      filename: __filename
    , tests: is.deepEqual([])
    , errors: [is.equal(err)]
    , status: Report.status.error
    })
}

test ['test functions are chainable'] = function (){

 var r = Report(__filename)
 
 it(r.test('name')).equal(r)
 it(r.error("ERROR")).equal(r)

}

helper.runSync(test)
