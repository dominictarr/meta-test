
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

  var timeToRun = opts.timeout || 30e3
    , timer = 
        setTimeout(function stop (){
          child.kill('SIGTSTP')
          errors.push(new Error("test '" + opts.filename + "' did not complete in under " + timeToRun + " milliseconds"))
          timer = setTimeout(function kill(){
            child.kill()
            errors.push(new Error("test didn't exit properly after timeout. KILLED."))
          },250)
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
          fs.unlink(opts.tempfile) 
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
