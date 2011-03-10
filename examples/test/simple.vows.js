
var vows = require('vows')
  , assert = require("assert")
  , suite = vows.describe('simple.vows')
  , reporter = new(require('meta-test/report'))('simple.vows')
  
suite.addBatch({
  'the number 7':{
    topic: 7
  , 'should equal 3+4': function (seven){
      assert.equal(seven,  3 + 4)
    }
  , '10 - x should equal 3': function (seven){
      assert.equal(10 - seven,  3)
    }
  }
}).export(module)//.run()
/*
  suite.reporter = {
      name: 'vows-adapter'
    , reset: function (){}
    , report: function (data){
          console.log(data)
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
  }*/
/*  console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$')
  suite.run(function (){
  console.log('________________________________--')
  
  })*/

//  console.log(reporter.report)


//suite.run()
//

