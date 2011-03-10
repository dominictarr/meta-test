/*
simplest test runner.

child-side
  { adapter:  require test adapter (if it is defined)
  , version: v0.4.1
  , test:  require module
  , tempfile: write on exit }
  on exit
    write report to temp file.

parent-side
  start child with a json payload of require, adapter, tempfile
  
  when child exits, check if temp file created, scrape std error if exit value is non zero.

*/

var Report = require('./report')
  , Plugins = require('./plugins')
  , fs = require('fs')
  , untangle = require('trees').untangle

var spawn = require('child_process').spawn
  , util = require('sys')

exports.run = run

function run(opts,cb){

  opts.tempfile = '/tmp/test_' + Math.round(Math.random()*10000)

  var child = spawn((opts.command || process.execPath), [ __dirname + '/child_runner.js', JSON.stringify(opts) ])
    , stderr = ''
    , errors = []

  child.stdout.on('data',function(e){ process.stdout.write(e) })
  child.stderr.on('data',function(e){ stderr += '' + e; process.stderr.write(e) })

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
        else
          errors.push(err)
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
            , version: opts.version
            })
        }
      }

  })
}
