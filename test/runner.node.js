//runner.asynct.js
var runner = require('../runner')
  , it, is = it = require('it-is')
  , log = console.log
  , helper = require('./lib/helper')
  , platform = require('../platform')
  , path = require('path')

exports ['run a file and make a report'] = function (finish){
  var testFile = path.join(__dirname, '..','examples/test/pass.node.js')

  var cp = runner.run({filename:testFile },helper.try(cb,1000))
  
  function cb(err,report){
    console.log(report)
    it(report)
      .has({
        filename: testFile
      , meta: {adapter: 'node'}
      , tests: is.deepEqual([])
      , failures: is.deepEqual([])
      , status: 'success'
      })
    finish()
  }

  it(cp).has({
    stdout: it.property('on',it.function()),
    stderr: it.property('on',it.function())
  })

}

//*/

function hasError(testFile,check,done){
  testFile = path.join(__dirname, '..',testFile)
  var cp = runner.run({filename:testFile },helper.try(cb,1000))
  
  function cb(err,report){
    it(report)
      .has({
        filename: testFile
      , meta: {adapter: 'node'}
      , tests: is.deepEqual([])
      , failures: check
      , status: 'error'
      })
    done()
  }

}

exports ['run a file that errors weird'] = function (finish) {
  hasError('examples/test/null.node.js',[is.equal(null)],finish)
}

exports ['run a file that errors'] = function (finish) {
  hasError('examples/test/error.node.js',[is.ok()],finish)
}

exports ['run a file that errors async'] = function (finish) {
  hasError('examples/test/async_error.node.js',[is.ok()],finish)
}

exports ['run a file with syntax error'] = function (finish) {
  hasError('examples/test/syntax_error.node.js',[is.ok()],finish)
}

exports ['run dummy-adapter'] = function (finish){

  var cp = runner.run({filename: './examples/test/pass.node.js', adapter: '../examples/dummy-adapter' }, check )
  
  function check (err,report){
    it(report)
      .has({
        failures: ['dummy-adapter']
      ,  tests: [
          { name: 'dummy1'
          , failures: [2345678] }
        , { name: 'dummy2'
          , failures: [7346546] }
        , { name: 'dummy3'
          , failures: [9327953] }
        ]
      })
    finish()
  }

}
//*/
exports ['stop child after timeout'] = function (finish){

  runner.run({filename: './examples/test/hang.node.js', adapter: 'node', timeout: 1e3 }, check )

  var timer = 
    setTimeout(function (){helper.crash("'stop child after timeout' TIMED OUT AFTER 5 SECONDS")},5e3)
    
  function  check(err,report){
    clearTimeout(timer)
    
    it(report)
      .has({  
        failures: [{ message: it.matches(/did not complete/) }]
      })

    finish()      
  }
}

exports ['defaults to current version'] = function (finish){

  var testFile = './examples/test/pass.node.js'

  runner.run({filename:testFile},helper.try(cb,1000))
  
  function cb(err,report){
    it(report)
      .has({
        filename: testFile
      , meta: {adapter: 'node'}
      , tests: is.deepEqual([])
      , failures: is.deepEqual([])
      , status: 'success'
      , version: process.version
      })
    finish()
  }
}

function checkAdapterDetection(testFile,adapter){

  exports['detects adapter if none given:' + adapter] = function (finish){

    function cb(err,report){
    console.log(report)
      it(report)
        .has({
          filename: testFile
        , meta: {adapter: adapter}
        , tests: it.property('length',it.ok())
        , version: process.version
        })
      finish()
    }

    runner.run({filename:testFile},helper.try(cb,1000))
  }
}

checkAdapterDetection('./examples/test/simple.nodeunit.js','nodeunit')
checkAdapterDetection('./examples/test/simple.vows.js','vows')


helper.runAsync(exports)
