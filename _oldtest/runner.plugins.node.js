//runner.plugins.node.js

//load runner with plugins which can change the default behaviour.

/*

runner.run({filename: FN, adapter: A, 
    plugins: [
      { require: path
      , args: [ARGUMENTS] }
    ]
  }, callback )

*/

// that wraps all tests and records meta data abouts them.
// add meta(key,content) to report (allows plugins to add arbitary data to test report)
// the key lets you overwrite it later.

/*
hooks:

loadTests(testRequire,reporter,fallback)
loadAdapter(adapterRequire,reporter,fallback)
post shutdown
(don't allow plugins to block adapter shutdown but will tell them when it's happening).

then command line interface.

maybe ignore test directory for NpmMapper

this could all be done tomorrow!

*/ 

//dummy plugin just logs that it's me called in the report's meta field.

var runner = require('../runner')
  , it = require('it-is')
  , log = console.log
  , helper = require('../helper')
  , path = require('path')

exports ['load a logger plugin that records the hooks'] = function (finish){

  runner.run({
    filename:'./examples/test/pass.node'
  , adapter: 'node'
  , plugins: [{require: './plugins/logger' }]
  }, helper.try(check,1000) )
  
  function check(err,report){
  
    it(report)
      .has({
        meta: {
          loadTest: it.ok()
        , loadAdapter: it.ok()
        }
      })
    finish()
  }
}

exports ['load remapper plugin that detects dependencies'] = function (finish){
  console.log(process.version)
  runner.run({
    filename: path.join(__dirname,'../examples/test/pass.node')
  , adapter: 'node'
  , plugins: [{require: './plugins/remapper' }]
  }, helper.try(check,1000) )
  
  function check(err,report){
  
//    it(report.status).equal('success')
  
    it(report)
      .has({
        version: process.version
      , meta: {
          remapper: {depends: it.ok()}
        }
      })
    finish()
  }
}
//*/
exports ['load a npm-remapper plugin that detects npm-package dependencies'] = function (finish){
  console.log(process.version)
  runner.run({
    filename: path.join(__dirname,'../examples/test/pass.node')
  , adapter: 'node'
  , plugins: [{require: './plugins/npm-remapper' }]
  }, helper.try(check,1000) )
  
  function check(err,report){
  
//    it(report.status).equal('success')
  
    it(report.errors).deepEqual([])
  
    it(report)
      .has({
          meta: {
          'npm-remapper': {depends: it.ok()}
        }
      })
      
    finish()
  }
}


helper.runAsync(exports)
