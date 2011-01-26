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


han't implemented an adapter yet, but this is enough to run node scripts. 

next:

  adapter: 
    sync - simplified expresso-style but with set-in-stone api.
    async - async_testing/nodeunit.

  runner:
    command line runner
    plugin renderer
    
  I should make the CLI first, so I can start using it. then i write node test scripts for everything else.
*/

var Report = require('./report')
  , fs = require('fs')

if (require.main == module) { //child side

  var payload = JSON.parse(process.argv[2])
    , errors = []
    , Report = require('./report')
    , reporter = new Report(payload.filename)
    , shutdown

  require.paths.unshift('.')
  
  /*
    NEXT: make runner use adapters.  
  */

  var tests = require(payload.filename)

  if(payload.adapter){

    require.paths.unshift(__dirname + '/adapters')
    var adapter = require(payload.adapter)
    require.paths.shift(__dirname + '/adapters')

    shutdown = adapter.run(tests,reporter)
  }
  process.on('exit',function(){
    if(shutdown) shutdown()    
    
    fs.writeFileSync(payload.tempfile,JSON.stringify(reporter.report))
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

    child.stdout.on('data',function(e){process.stdout.write(e)})
    child.stderr.on('data',function(e){stderr += '' + e})
  
    child.on('exit',function (exStatus){
      var errors = exStatus ? [stderr,exStatus]: []
      
      fs.readFile(opts.tempfile, 'utf-8', c)
      function c(err,json){
        if(err)//file did not exist
          cb(null,{ filename: opts.filename
            , tests: []
            , status : 'error'
            , errors: errors
            })
        else
          cb(null,JSON.parse(json))
      }
    })
  }
}

