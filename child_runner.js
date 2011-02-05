//child_runner

/*
NEXT: add plugins.
*/

var Report = require('./report')
  , fs = require('fs')
  , log = console.log
  , untangle = require('trees/untangle2')
  
  var payload = JSON.parse(process.argv[2])
    , errors = []
    , Report = require('./report')
    , reporter = new Report(payload.filename)
    , shutdown
//    , r = new Remapper(module, payload.remap)
    , r = {require: require, depends: {}} //disabled so it will run in 0.2.x
    , failed
    , tests

  try{
    tests = r.require(payload.filename)
  } catch(error){
    failed = true
    reporter.error(error)  
  }
  if(!failed && payload.adapter) {
    r.require.paths.unshift(__dirname + '/adapters')

    var adapter = r.require(__dirname + '/adapters/' +payload.adapter)

    shutdown = adapter.run(tests,reporter)
  }

  process.on('exit',function(){
  
    if(shutdown) shutdown()
    
    reporter.report.depends = r.depends

    fs.writeFileSync(payload.tempfile,untangle.stringify(reporter.report))
  })
