//client-runner
exports = run

function run (opts,done){
var Report = require('meta-test/report')
  , adapter = require(adapter)
  , reporter = new Report(opts.test)
  , shutdown = function (){}

  try{
    var test = require(test)
    shutdown = adapter.run(test,reporter)
  } catch (err) {
    reporter.error(err)
  }

  setTimeout(function (){
    try{
      shutdown()
    } catch (err) {
      reporter.error(err)
    }
    done(null,reporter.report)
  },opts.timeout || 100)
}