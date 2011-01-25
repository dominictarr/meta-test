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

  require.paths.unshift('.')
  
  /*
    NEXT: make runner use adapters.  
  */

  require(payload.filename)

  process.on('exit',function(){
    var report = 
        { filename: payload.filename
        , tests: []
        , status : 'success'
        , errors: errors
        }
    fs.writeFileSync(payload.tempfile,JSON.stringify(report))
  })

} else { 
  // parent-side
  // start child and when it exits check for the temp file, and scrape stderr

  exports.test = test
  var spawn = require('child_process').spawn
    , util = require('util')

  function test(opts,cb){
        
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

