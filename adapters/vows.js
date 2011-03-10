// vows adapter

exports.run = run

/*{ 'honoured': 'success'
, 'broken': 'failure'
, 'errored': 'error' }*/

var vows = require('vows')

function runTest(suite,reporter){
  suite.reporter = {
      name: 'vows-adapter'
    , reset: function (){}
    , report: function (data){
        if(data[0] === 'vow') {
        var test = data[1]
          , name = test.context + '\n  ' + test.title

        reporter.test(name)
        if(test.status == 'broken')
          reporter.test(name, {
            name: 'AssertionError'
          , message: test.exception
          , stack: test.exception + '\n[patch github.com/cloudhead/vows for stacktrace]' 
          })
        else if(test.exception)
          reporter.test(name, test.exception)
      }
    }
  }
  suite.run()
}

function run (test,reporter){

Object.keys(test).forEach(function (e){
  var suite = vows.describe(e)
  test[e].batches.forEach(function (b){
    suite.addBatch(b.tests)
  })

  runTest(suite,reporter)
})

return function (){} //shutdown function
}
