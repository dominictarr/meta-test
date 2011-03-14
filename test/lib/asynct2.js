//asynct.js

//simple async test adapter

var assert = require('assert')
  , ctrl = require('ctrlflow') 
exports.run = run

  Tester.prototype = assert

  function Tester (next,name){
    this.done = next
    this.finish = next
    this.name = name
    this.catch = null
    this.uncaughtExceptionHandler = null
  }


function run (tests,reporter){

  var tests = Object.keys(tests).map(function (name,test){
    function (){
      reporter.test(name)
      var next = this.next
      process.removeAllListeners('uncaughtException')
      process.on('uncaughtException',function (err){
        reporter.test(name,err)
        next()
      })
      test.apply(null,new Tester(name,next))
    }
  })
  
  ctrl.seq(tests,0)
  
  return function (){}
  
}