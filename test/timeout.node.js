//runner.asynct.js
var runner = require('../runner')
  , it, is = it = require('it-is').style('colour')
  , log = console.log
  , helper = require('./lib/helper')
  , platform = require('../platform')
  , path = require('path')

exports ['run a file and make a report'] = function (finish){
  var testFile = path.join(__dirname, '..','examples/test/timeout.asynct.js')

  runner.run({filename:testFile, adapter: 'asynct', timeout: 1e3},helper.try(cb,1500))
  
  function cb(err,report){
    it(report)
      .has({
        name: testFile
      , tests: [ { failures: [ {message: "INTENSIONAL ERROR"} ] } ]
        , failures: [
        {message: it.matches(/timeout/)}
      , {message: it.matches(/did not complete/)}
      ]
      , status: 'error'
      })
    finish()
  }
}

exports ['run a file and make a report - expresso'] = function (finish){
  var testFile = path.join(__dirname, '..','examples/test/timeout.asynct.js')

  runner.run({filename:testFile, adapter: 'expresso', timeout: 1e3},helper.try(cb,1500))
  
  function cb(err,report){
    it(report)
      .has({
        name: testFile
      , tests: [ { failures: [ {message: "INTENSIONAL ERROR"} ] } ]
      , failures: [
        {message: it.matches(/timeout/)}
      , {message: it.matches(/did not complete/)}
      ]
      , status: 'error'
      })
    finish()
  }
}


helper.runAsync(exports)