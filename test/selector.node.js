  
var it = require('it-is')
  , helper = require('./lib/helper')
  , selector = require('../selector')
  , path = require('path')
  , log = console.log

/*
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
*/

exports ['findAll'] = function (){
  var examples = 
      [ {filename: "null.node.js"           , adapter: 'node' }
      , {filename: "syntax_error.node.js"   , adapter: 'node' }
      , {filename: "pass.node.js"           , adapter: 'node' }
      , {filename: "test-synct-pass.js"     , adapter: 'synct'} 
//      , {filename: "testSomethingAsync.js"  , adapter: 'asynct'} 
]

    , files = 
  examples.map(function (e){
    e.filename = 
      path.join(__dirname,'../examples/test', e.filename)//here is problem! see also adapters/selector.js 130

      /*
      OKAY! this is a problem handling both local, relative and absolute paths.

      this is causing problems due to different env between this test and invoking selector on cmd line.
      */

    return e.filename
  })

  var found = selector.findAll(files)

  it(found).has(examples)

}

exports ['findAll absolute'] = function (){
  var examples = 
      [ {filename: "null.node.js"           , adapter: 'node' }
      , {filename: "syntax_error.node.js"   , adapter: 'node' }
      , {filename: "pass.node.js"           , adapter: 'node' }
      , {filename: "test-synct-pass.js"     , adapter: 'synct'} 
      ]

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

  var found = selector.findAll(files)

  it(found).has(examples)  

}

exports ['default'] = function (){
  var examples = 
      [ {filename: "selector.node.js"    , adapter: 'node' }
      , {filename: "report.expresso.js"  , adapter: 'expresso'} ]

    , files = 
  examples.map(function (e){
    e.filename = 
      path.join(e.filename)
      
    return e.filename
  })

  var found = selector.findAll(files)

  it(found).has(examples)  

}

exports ['guess adapter from package.json'] = function (){
var examples = [
  [ { scripts: {test: 'expresso'}}, 'expresso'],
  [ { scripts: {test: 'vows test/*.js'}}, 'vows'],
  [ { devDependencies: {expresso: '0.0.1'}}, 'expresso'],
  [ { devDependencies: {vows: '0.0.1'}}, 'vows'],
  [ { scripts: {test: 'nodeunit'}}, 'nodeunit'],
  [ { scripts: {test: 'async_testing test/*.js'}}, 'async_testing'],
  [ { devDependencies: {nodeunit: '0.0.1'}}, 'nodeunit'],
  [ { devDependencies: {async_testing: '0.0.1'}}, 'async_testing'],
  ]
  
  it(examples).every(function (e){ 
    it(selector.guess(e[0])).equal(e[1])
  })

}

helper.runSync(exports) //run all tests
