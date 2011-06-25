
/**
  it's coming time for an overhaul of how runners are setup.
  better to provide support for running all tests and rolling them into one big report. (with status and totals)
  also, i've since learnt about process.cwd() etc. 
  
  adapters should be detected here (and should they even be called adapters)
  
  also, I want to pull adapters out into thier own modules 
  
  (that will be a big reorg.)

*/

var Report = require('./report')
  , Plugins = require('./plugins')
  , selector = require('./selector')
  , fs = require('fs')
  , untangle = require('trees').untangle
var spawn = require('child_process').spawn
  , util = require('sys')

exports.run = run

exports.version = JSON.parse(fs.readFileSync(__dirname + '/package.json')).version

function run(opts,cb){

  opts.tempfile = '/tmp/test_' + Math.round(Math.random()*10000)
  if(!opts.adapter){
    opts.adapter = selector.findAdapter(opts.filename) 
  }
  var child = spawn((opts.command || process.execPath), [ __dirname + '/child_runner.js', JSON.stringify(opts) ])
    , stderr = ''
    , failures = []

  child.stdout.on('data',function(e){ process.stdout.write(e) })
  child.stderr.on('data',function(e){ stderr += '' + e; process.stderr.write(e) })

  var timeToRun = opts.timeout || 30e3
    , timer =
        setTimeout(function stop (){
          child.kill('SIGTSTP')
          failures.push(new Error("test '" + opts.filename + "' did not complete in under " + timeToRun + " milliseconds"))
          timer = setTimeout(function kill(){
            child.kill()
            failures.push(new Error("test didn't exit properly after timeout. KILLED."))
          },250)
        },timeToRun)

  child.on('exit',function (exStatus){
  
      if(exStatus){
        failures.push(stderr)
        failures.push(exStatus)
      }
      clearTimeout(timer)
      fs.readFile(opts.tempfile, 'utf-8', c)

      function c(err,json){
        if(!err)
          fs.unlink(opts.tempfile) 
        else
          failures.push(err)
        try {
          var report = untangle.parse(json)
          report.failures = [].concat(report.failures).concat(failures)
          if(report.failures.length && report.status  === 'success')
            report.status = 'error'
          cb(null,report)
        } catch (err){
          cb(null,{ filename: opts.filename
            , name: opts.filename
            , tests: []
            , status : 'error'
            , meta: {adapter: opts.adapter || 'node'}
            , failures: failures
            , version: opts.version
            })
        }
      }
  })
  return child //return the child process so that it is possible to extract the output
}