#! /usr/bin/env node 

//if(require.main == module){
var runner = require('./runner')
//  , selector = require('./selector')
//  , path = require('path')
//  , files = []
  , pretty = require('./pretty')
  , parse = require('./arg-parser').parse
  , inspect = require('render')
var tests = [] 
  , reports = []
  , parsed
  , log = require('logger')
/*files = process.argv.slice(2).map(function (file){
  return path.join(process.env.PWD,file)
})
tests = selector.findAll(files)
*/
parsed = parse(process.argv.slice(2))
tests = parsed.tests

next()

function next (){
  var test = tests.shift()
  if(!test)
    return finish()
/*  if(parsed.timeout)
    test.timeout = parsed.timeout*/
  runner.run(test, done)
  
  function done(err,report){
    if(err) throw err
    reports.push(report)
    next()
  }
}

function finish(){
  console.log("Meta-Test ~ " + new Date + "\n")

  reports.map(function (e){
    if(parsed.logger == 'pretty')
      pretty.print(e)
    else
      console.log(inspect(e, {multi: true}))
      
    if(tests.depends)
      console.log(inspect(e.depends, {multi: true}))
  })
  console.log(pretty.bar(reports))
}

//heh, i was putting off writing this for some reason, but now i realise that this is actually enough to go on with.
//next is to add adapters.
//}
