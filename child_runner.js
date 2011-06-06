//child_runner

/*
NEXT: add plugins.
*/

var /*depends = require('./depends')
  ,*/ Report = require('./report')
  , fs = require('fs')
  , log = console.log
  , untangle = require('trees').untangle
  , loader = require('./loader')
  
  var payload = JSON.parse(process.argv[2])
    , errors = []
    , Report = require('./report')
    , reporter = new Report(payload.filename)
    , shutdown
    , failed
    , tests
    , adapter = 'node'

/*if(payload.remaps)
  depends.remap(payload.remaps)
*/
  try{
    tests = loader.load(payload.filename)
  } catch(error){
    failed = true
    reporter.error(error)  
  }
  if(!failed && payload.adapter) {

    adapter = require(__dirname + '/adapters/' +payload.adapter)

    shutdown = adapter.run(tests,reporter, function (){})
  }

  process.on('SIGTSTP',function (){
    reporter.error(new Error("recieved stop signal due to timeout"))
    process.exit()
  })

  function exit (){
  
    if(shutdown) shutdown()
    reporter.meta('adapter', payload.adapter)
/*    reporter.meta('depends',depends.sorted(__dirname + '/loader.js').map(function (e){
      return {
        filename: e.filename
      , resolves: e.resolves
      }
    
    }))*/

    fs.writeFileSync(payload.tempfile,untangle.stringify(reporter.report))

  }

  process.on('exit',exit)
