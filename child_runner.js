//child_runner

/*
NEXT: add plugins.
*/

var Report = require('./report')
  , fs = require('fs')
  , log = console.log
  , untangle = require('trees/untangle')
  , Plugins = require('./plugins')
  
  
  var payload = JSON.parse(process.argv[2])
    , errors = []
    , Report = require('./report')
    , reporter = new Report(payload.filename)
    , shutdown
//    , r = new Remapper(module, payload.remap)
    , r = {require: require, depends: {}} //disabled so it will run in 0.2.x
    , failed
    , tests
    , hooks = new Plugins({
      loadTest: require
    , loadAdapter: require 
    , exit: function (){}
    }).load(payload.plugins)

  console.log( "$$$$$$$$$$$", process.version , "$$$$$$$$$$$")
  console.log( "--->", payload.version)
console.log(payload)

    
    console.log(payload.plugins)
    console.log(hooks)

  try{
    tests = hooks.loadTest(payload.filename,reporter)
  } catch(error){
    failed = true
    reporter.error(error)  
  }
  if(!failed && payload.adapter) {

    var adapter = hooks.loadAdapter(__dirname + '/adapters/' +payload.adapter,reporter)

    shutdown = adapter.run(tests,reporter)
  }

  process.on('exit',function(){
  
    if(shutdown) shutdown()

    hooks.exit(reporter)
    
    reporter.report.depends = {} //r.depends

    fs.writeFileSync(payload.tempfile,untangle.stringify(reporter.report))
  })
