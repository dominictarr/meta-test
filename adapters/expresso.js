

var old = require.extensions['']
  , fs = require('fs')

if(!old)
  require.extensions[''] = function (){}
  
  var fn = require.resolve('expresso/bin/expresso')
  var expresso = fs.readFileSync(fn,'utf-8')
  
  require.extensions[''] = old

  expresso = expresso.replace ("defer;", "defer = true;")
  expresso = expresso.replace ("#!", "//#!")

exports.run = run 

function run (tests,reporter){

  for(var name in tests){
    reporter.test(name) //record each test.
  }

  //load expresso into this closure

  eval(expresso) 

 //overwrite error handler to write report.

  error = function error (suite, test, err){ 
      reporter.test(test,err)
  }  
  
  //silence expresso report

  report = function (){}

  //unmonkeypatch process

  process.emit = orig

  runSuite(reporter.filename,tests)

  return function (){
    process.emit('beforeExit')
    process.removeAllListeners('uncaughtException')
  }
}
