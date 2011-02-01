/*
simplest test runner.

child-side
  { adapter:  require test adapter (if it is defined)
  , test:  require module
  , tempfile: write on exit }
  on exit
    write report to temp file.

parent-side
  start child with a json payload of require, adapter, tempfile
  
  when child exits, check if temp file created, scrape std error if exit value is non zero.

*/

var Report = require('./report')
  , Remapper = new require('remap/remapper')
  , fs = require('fs')
  , log = require('logger')
  , untangle = require('trees/untangle2')

if (require.main == module) { //child side

  var payload = JSON.parse(process.argv[2])
    , errors = []
    , Report = require('./report')
    , reporter = new Report(payload.filename)
    , shutdown
    , r = new Remapper(module, payload.remap)
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

} else {
  // parent-side
  // start child and when it exits check for the temp file, and scrape stderr

  exports.run = run
  var spawn = require('child_process').spawn
    , util = require('util')

  function run(opts,cb){
    opts.tempfile = '/tmp/test_' + Math.round(Math.random()*10000)
    var child = spawn('node', [ __filename, JSON.stringify(opts) ])
      , stderr = ''
      , errors = []

    child.stdout.on('data',function(e){process.stdout.write(e)})
    child.stderr.on('data',function(e){stderr += '' + e
      process.stdout.write(e)
    })
  
    var timeToRun = opts.timeout || 30e3 //default to 30 seconds timeout
      , timer = 
          setTimeout(function stop (){
            child.kill()
            errors.push(new Error("test '" + opts.filename + "' did not complete in under " + timeToRun + " milliseconds"))
          },timeToRun)

    child.on('exit',function (exStatus){
      if(exStatus){
        errors.push(stderr)
        errors.push(exStatus)
      }
      clearTimeout(timer)
      fs.readFile(opts.tempfile, 'utf-8', c)
      function c(err,json){
        if(!err)
          fs.unlink(opts.tempfile) //delete temp file.

        try {
          var report = untangle.parse(json)
          report.errors = [].concat(report.errors).concat(errors)
          if(report.errors.length)
            report.status = 'error'
          cb(null,report)
        } catch (err){
          cb(null,{ filename: opts.filename
            , tests: []
            , status : 'error'
            , errors: errors
            })
        }
      }
    })
  }
}

