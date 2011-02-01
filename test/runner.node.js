//runner.asynct.js
var runner = require('../runner')
  , it, is = it = require('it-is')
  , log = require('logger')
  , helper = require('../helper')

exports ['run a file and make a report'] = function (finish){
  var testFile = 'meta-test/examples/test/pass.node.js'

  runner.run({filename:testFile },helper.try(cb,1000))
  
  function cb(err,report){
    it(report)
      .has({
        filename: testFile
      , tests: is.deepEqual([])
      , errors: is.deepEqual([])
      , status: 'success'
      })
    finish()
  }
}

//*/

function hasError(testFile,check,done){
  runner.run({filename:testFile },helper.try(cb,1000))
  
  function cb(err,report){
    it(report)
      .has({
        filename: testFile
      , tests: is.deepEqual([])
      , errors: check
      , status: 'error'
      })
    done()
  }
}

exports ['run a file that errors weird'] = function (finish) {
  hasError('meta-test/examples/test/null.node.js',[is.equal(null)],finish)
}

exports ['run a file that errors'] = function (finish) {
  hasError('meta-test/examples/test/error.node.js',[is.ok()],finish)
}

exports ['run a file that errors async'] = function (finish) {
  hasError('meta-test/examples/test/async_error.node.js',[is.ok()],finish)
}

exports ['run a file with syntax error'] = function (finish) {
  hasError('meta-test/examples/test/syntax_error.node.js',[is.ok()],finish)
}

exports ['run dummy-adapter'] = function (finish){

  runner.run({filename: './examples/test/pass.node.js', adapter: '../examples/dummy-adapter' }, check )
  
  function check (err,report){
    it(report)
      .has({
        errors: ['dummy-adapter']
      ,  tests: [
          { name: 'dummy1'
          , failures: [2345678] }
        , { name: 'dummy2'
          , failures: [7346546] }
        , { name: 'dummy3'
          , failures: [9327953] }
        ]
      })
  }
}

helper.runAsync(exports)


