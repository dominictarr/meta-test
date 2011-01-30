
var it = require('it-is')
  , helper = require('../helper')
  , selector = require('../selector')
  , path = require('path')

exports ['simple selector'] = function (){

  var obj = {
    'path/to/test-y.js': 'adapter' 
  , 'path/to/test-z.js':'different'
  }

  it([

    ['path/to/x.adapter.js',['adapter'],'adapter']
  , ['path/to/x.adapter.js',[function (){return 'xyz'}],'xyz']
  , ['path/to/x.matches.js',[/^.+\.(\w+)\.\w+$/],'matches']
  , ['path/to/test-y.js',[obj],'adapter']
  , ['path/to/test-z.js',[obj],'different']

  ]).every(function (actual){

    it(selector.select(actual[0],actual[1])).equal(actual[2])
  
  })
}

var log = require('logger')

exports ['find'] = function (){
  var examples = 
      [ {filename: "null.node.js"           , adapter: 'node' }
      , {filename: "syntax_error.node.js"   , adapter: 'node' }
      , {filename: "pass.node.js"           , adapter: 'node' }
      , {filename: "test-synct-pass.js"     , adapter: 'synct'} 
      , {filename: "testSomethingAsync.js"  , adapter: 'asynct'} ]

    , files = 
  examples.map(function (e){
    e.filename = 
      path.join('examples/test', e.filename)//here is problem! see also adapters/selector.js 130
      
      /*
      OKAY! this is a problem handling both local, relative and absolute paths.
      
      this is causing problems due to different env between this test and invoking selector on cmd line.
      
      */
      
    return e.filename
  })

  var found = selector.find(files)

  it(found).has(examples)  

}

exports ['find absolute'] = function (){
  var examples = 
      [ {filename: "null.node.js"           , adapter: 'node' }
      , {filename: "syntax_error.node.js"   , adapter: 'node' }
      , {filename: "pass.node.js"           , adapter: 'node' }
      , {filename: "test-synct-pass.js"     , adapter: 'synct'} 
      , {filename: "testSomethingAsync.js"  , adapter: 'asynct'} ]

    , files = 
  examples.map(function (e){
    e.filename = 
      path.join(__dirname, '../examples/test', e.filename)//here is problem! see also adapters/selector.js 130
      
      /*
      OKAY! this is a problem handling both local, relative and absolute paths.
      
      this is causing problems due to different env between this test and invoking selector on cmd line.
      
      */
      
    return e.filename
  })

  var found = selector.find(files)

  it(found).has(examples)  

}

exports ['default'] = function (){
  var examples = 
      [ {filename: "selector.node.js"           , adapter: 'node' }
      , {filename: "report.expresso.js"  , adapter: 'expresso'} ]

    , files = 
  examples.map(function (e){
    e.filename = 
      path.join(e.filename)
      
    return e.filename
  })

  var found = selector.find(files)

  it(found).has(examples)  

}



helper.runSync(exports) //run all tests

