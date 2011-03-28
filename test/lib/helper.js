//helper.js
var it = require('it-is')

exports.isPass = isPass
exports.isFail = isFail
exports.isError = isError

exports.runSync = runSync
exports.runAsync = runAsync

exports.crash = crash
exports['try'] = TRY
exports.checkCall = checkCall


function isPass(name){
  return it.has({ name: name
          , status: 'success' } )
}
function isFail(name,fail){
  return it.has({ name: name
          , status: 'failure' 
          , failures: [{name: "AssertionError"}]
          })
}
function isError(name,error){
  var errors = Array.isArray(error) ? error : [error]
  if(arguments.length <= 1)
    errors = []
  return it.has({ name: name
          , status: 'error' 
          , failures: errors
          } )
}

function runSync(tests){
  for(var name in tests){
    console.log("TEST:",name)
    tests[name]()
  }
  console.log('*all passed*')
}

//dump an error message and exit, without being intercepted by process.on('uncaughtException',...)
function crash(error){
  console.log("CRASH! '" + ( error ? (error.type ? error.type : error) : error )  + "'")
//  console.error("CRASH!")
  console.error(error)
  process.exit(1)
}

function checkCall (func,timeout){
  var timer
  if(timeout)
    timer = setTimeout(function (){
      crash("expected " + func + "to be called within " + timeout)}
    , timeout)

  return function (){
    if(timeout)
      clearTimeout(timer)
    func.apply(null,arguments)
  }
}

function TRY (func,timeout){
  var call = checkCall(func,timeout)

  return function (){
    try{
      call.apply(null,arguments)
    }catch(error){
      crash(error ? (error.stack ? error.stack : error) : error)
    } 
  }
}

//setInterval(function (){console.log('.')},50)

function runAsync(tests){
  var names = Object.keys(tests)

  next()

  function next(){
    var name = names.shift()
    if(name){
      console.log("TEST:",name)
      tests[name](function (){process.nextTick(next)})
    } else
      console.log('*all passed*')
  }
}


