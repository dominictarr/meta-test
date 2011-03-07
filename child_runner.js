//child_runner

/*
NEXT: add plugins.
*/

var Report = require('./report')
  , fs = require('fs')
  , log = console.log
  , untangle = require('trees').untangle
//  , Plugins = require('./plugins')
  , depends = require('./depends')
  , loader = require('./loader')

  
  
  var payload = JSON.parse(process.argv[2])
    , errors = []
    , Report = require('./report')
    , reporter = new Report(payload.filename)
    , shutdown
//    , r = new Remapper(module, payload.remap)
//    , r = {require: require, depends: {}} //disabled so it will run in 0.2.x
    , failed
    , tests
/*    , hooks = new Plugins({
      loadTest: require
    , loadAdapter: require 
    , exit: function (){}
    }).load(payload.plugins)*/

  console.log( "$$$$$$$$$$$", process.version , "$$$$$$$$$$$")
  console.log( "--->", payload.version)
  console.log(payload)

if(payload.remaps)
  depends.remap(payload.remaps)
    console.log(payload.remaps)

  try{
    tests = loader.load(payload.filename)
//    tests = hooks.loadTest(payload.filename,reporter)
  } catch(error){
    failed = true
    reporter.error(error)  
  }
  if(!failed && payload.adapter) {

//    var adapter = hooks.loadAdapter(__dirname + '/adapters/' +payload.adapter,reporter)
//    var adapter = loader.load(__dirname + '/adapters/' +payload.adapter)
    var adapter = require(__dirname + '/adapters/' +payload.adapter)

    shutdown = adapter.run(tests,reporter)
  }

  process.on('exit',function(){
  
    if(shutdown) shutdown()

//    hooks.exit(reporter)
    
    reporter.meta('depends',depends.sorted(__dirname + '/loader.js').map(function (e){
      return {
        filename: e.filename
      , resolves: e.resolves
      }
    
    }))

//    fs.writeFileSync(payload.tempfile,untangle.stringify(reporter.report))
    fs.writeFileSync(payload.tempfile,untangle.stringify(reporter.report))
  })
