
if(require.main == module){
  var log = require('logger')
    , runner = require('./runner')
    , selector = require('./selector')
    var tests = selector.find(process.argv.slice(2))
      , reports = []

    log(tests)  

    next()
    
    function next (){
      var test = tests.shift()
      if(!test)
        return finish()
      log('run:', test)
      runner.test(test, done)
      
      function done(err,report){
        if(err) throw err
        reports.push(report)
        next()
      }
    }

    function finish(){
      log(reports)
    }
  
//heh, i was putting off writing this for some reason, but now i realise that this is actually enough to go on with.
//next is to add adapters.
}
