
var runner = require('../runner')
  , it, is = it = require('it-is')
  , log = console.log
  , helper = require('./lib/helper')
  , platform = require('../platform')
  , path = require('path')


exports ['run multiple node versions'] = function (finish){

  var target = (process.version == 'v0.3.2') ? 'v0.3.1' : 'v0.3.2' //test a different version

  var testFile = './examples/test/pass.node.js'

  runner.run({filename:testFile, command: platform.command(target)},helper.try(cb,1000))
  
  function cb(err,report){
    it(report)
      .has({
        filename: testFile
      , tests: is.deepEqual([])
      , errors: is.deepEqual([])
      , status: 'success'
      , version: target
      })
    finish()
  }
}

helper.runAsync(exports)
