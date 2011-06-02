

var nodeunit = require('nodeunit/lib/core')

exports.run = run

function run (tests,reporter,callback){

  var finished = {}
  
  nodeunit.runSuite(null,tests,{
    testStart: function (name) {
      currentTest = '' + name
      finished [name] = false;
      reporter.test('' + name)
    },
    log: function (assertion) {
        if(assertion.failed())
          reporter.test(currentTest, assertion.error)
    },
    testDone: function (name, assertions) {
      finished [name] = true;
    },
    moduleDone: function (name, assertions) {

    }
  },callback)

  return function (){ 

    process.removeAllListeners('uncaughtException') 

    for(var name in finished){
      if(!finished [name] && reporter.tests[name].status != 'error')
        reporter.test(name,new Error("test '" + name + "' did not call test.done"))
    }
  }
}
