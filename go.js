#! /usr/bin/env node 

//if(require.main == module){
var log = require('logger')
  , runner = require('./runner')
  , selector = require('./selector')
  , path = require('path')
  , files = []
  , pretty = require('./pretty')

var tests = [] 
  , reports = []

files = process.argv.slice(2).map(function (file){
  return path.join(process.env.PWD,file)
})
tests = selector.find(files)

log("TESTS",tests)
log(__dirname)

next()

function next (){
  var test = tests.shift()
  if(!test)
    return finish()
  log('run:', test)
  runner.run(test, done)
  
  function done(err,report){
    if(err) throw err
    reports.push(report)
    next()
  }
}

function finish(){
  reports.map(pretty.print)
  console.log(pretty.bar(reports))
}

//heh, i was putting off writing this for some reason, but now i realise that this is actually enough to go on with.
//next is to add adapters.
//}
