//runner.asynct.js
var runner = require('../runner')
  , it, is = it = require('it-is')
  , log = require('logger')

exports ['run a file and make a report'] = function (test){
  var testFile = 'meta-test2/examples/test/pass.node.js'

  runner.test({filename:testFile },cb)
  
  function cb(err,report){
    it(report)
      .has({
        filename: testFile
      , tests: is.deepEqual([])
      , errors: is.deepEqual([])
      , status: 'success'
      })
    test.finish()
  }
}

//*/

function hasError(testFile,check,done){
  runner.test({filename:testFile },cb)
  
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

exports ['run a file that errors weird'] = function (test) {
  hasError('meta-test2/examples/test/null.node.js',[is.ok()],test.finish)
}

exports ['run a file that errors'] = function (test) {
  hasError('meta-test2/examples/test/error.node.js',[is.ok()],test.finish)
}

exports ['run a file that errors async'] = function (test) {
  hasError('meta-test2/examples/test/async_error.node.js',[is.ok()],test.finish)
}

exports ['run a file with syntax error'] = function (test) {
  hasError('meta-test2/examples/test/syntax_error.node.js',[is.ok()],test.finish)
}


