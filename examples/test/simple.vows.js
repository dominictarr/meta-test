
var vows = require('vows')
  , suite = vows.describe('simple.vows');

suite.addBatch({
  'the number 7':{
    topic: 7
  , 'should equal 3+4': function (seven){
      assert.equal(3 + 4)
    }
  }
}).export(module)
