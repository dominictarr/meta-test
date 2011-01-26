//dummy-adapter.js

//does nothing but register a 'dummy' test with a dummy error, and so on.
//just used to test the runner.

exports.run = function run (tests,report){

  report.test('dummy1',2345678)
  report.test('dummy2',7346546)
  report.test('dummy3',9327953)
  
  report.error("dummy-adapter")
  
  return function (){}  
}



