// vows adapter

exports.run = run

/*{ 'honoured': 'success'
, 'broken': 'failure'
, 'errored': 'error' }*/

function run (vows,reporter){
  console.log("***")
  console.log(vows)
//  vows = vows.Vows || vows


  vows.reporter = {
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
        , stack: '[patch github.com/cloudhead/vows for stacktrace]' 
        })
      else if(test.exception)
        reporter.test(name, test.exception)
    }
  }
 }
vows.run()

return function (){} //shutdown function
}
