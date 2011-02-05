

var/* old = require.extensions['']
  ,*/ fs = require('fs')
  , log = require('logger')

/*if(!old)
  require.extensions[''] = function (){}*/
  
//var fn = require.resolve('expresso/bin/expresso')

//require.extensions[''] = old //do this differently so it works with 0.2.x

var expresso = fs.readFileSync(__dirname+'/lib/expresso','utf-8')
//var expresso = fs.readFileSync(fn,'utf-8')

expresso = expresso.replace ("defer;", "defer = true;")
expresso = expresso.replace ("#!", "//#!")

function copy(from,to){
  for(var i in from){
    to[i] = from[i]  
  }
  return to
}

exports.run = run 


function run (tests,reporter){

  //load expresso into this closure

  eval(expresso) 

  // wrap each test in adapter that bridges tj's api change

  Object.keys(tests).forEach(function (name){
  
    reporter.test(name) //record each test.
    
    var orig = tests[name]
    tests[name] = function (before){
      orig(copy(assert,before),before)
    }

  })

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
