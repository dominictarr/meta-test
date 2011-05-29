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
  , log = console.log

parsed = parse(process.argv.slice(2))
tests = parsed.tests

next()

function next (){
  var test = tests.shift()
  if(!test)
    return finish()

  runner.run(test, done)

  function done(err,report){
    if(err) throw err
    reports.push(report)
    //subreport 
    // -- move this (untested) code into runner, let it handle running each test.
    next()
  }
}

function finish(){
 if(parsed.logger == 'json')
   return console.log(JSON.stringify(reports))

  console.log("Meta-Test ~ " + runner.version + "\n")

  reports.map(function (e){
    if(parsed.logger == 'pretty'){
      pretty.print(e)
      if(parsed.meta)
        console.log('MetaData:\n',inspect(e.meta, {multi: true}))
    }else
      console.log(inspect(e, {multi: true}))
  })
  console.log(pretty.bar(reports))
}