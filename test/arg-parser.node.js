//arg-parser.node.js

var helper = require('./lib/helper')
  , it = require('it-is')
  , parser = require('../arg-parser')
  , path = require('path')
  , platform = require('../platform')

  platform.list = ['v0.3.0','v0.3.7', process.version] 
function parse(cmd,dir){

  var parsed = 
   parser.parse(cmd.split(' '),dir)
 
 return function (list){
  it(parsed.tests)
    .has(
      list.map(function (e){
        e.filename = path.join(dir,e.filename)  
        return e
      })  
    )
 }
}

var dir = __dirname + '/..'

exports ['parse args'] = function (){

  parse('-node arg-parser.node.js',dir + '/test')
  ( [ {filename:'./arg-parser.node.js', adapter: 'node',command: 'node'} ] )  

  parse('-node arg-parser.js -expresso test-something.js',dir + '/test')
  ( [ {filename:'./arg-parser.js', adapter: 'node',command: 'node'}
    , {filename:'./test-something.js', adapter: 'expresso',command: 'node'}
    ] )  

  parse('-node arg-parser.js -expresso test-something.js',dir + '/test')
  ( [ {filename:'./arg-parser.js', adapter: 'node',command: 'node'}
    , {filename:'./test-something.js', adapter: 'expresso',command: 'node'}
    ] )  

}

exports ['detect adapter'] = function (){

  parse('test/arg-parse.node.js examples/test/simple.vows.js',dir)
  ( [ {filename:'test/arg-parse.node.js', adapter: 'node',command: 'node'}
    , {filename:'examples/test/simple.vows.js', adapter: 'vows',command: 'node'}
    ] )
}

/*
remaps
-remap from -> to
-noremapc
*/

exports ['remaps'] = function (){
/*
  parse('--remap a.js --to b.js test/arg-parse.node.js',dir)
  ( [ {filename:'test/arg-parse.node.js', adapter: 'node', remap: {"a.js": "b.js" } ,command: 'node'}
    ] )

  parse('-r a.js -t b.js test/arg-parse.node.js examples/test/simple.vows.js -u examples/test/simple.nodeunit.js',dir)
  ( [ {filename:'test/arg-parse.node.js', adapter: 'node', command: 'node', remap: {"a.js": "b.js" } }
    , {filename:'examples/test/simple.vows.js', adapter: 'vows', command: 'node', remap: {"a.js": "b.js" } }
    , {filename:'examples/test/simple.nodeunit.js', adapter: 'nodeunit', command: 'node', }
    ] )
    */
  parse('--remaps {"./a":"./b"} test/arg-parse.node.js',dir)
    ( [ {filename:'test/arg-parse.node.js', adapter: 'node', remaps: {"./a": "./b" } ,command: 'node'}
    ] )

}

exports ['report & timeout'] = function (){

  it(parser.parse("-logger json -timeout 1e3".split(' '),dir))
    .has({
      logger: 'json'
    , timeout: 1000
    })

  //logger should default to 'pretty'

  it(parser.parse("-timeout 1000".split(' '),dir))
    .has({
      logger: 'pretty'
    , timeout: 1000
    })

  it(parser.parse("--version v0.3.0 hello.node.js".split(' '),dir))
    .has({
/*      version: 'v0.3.0'
    , */tests: [{version :'v0.3.0', command: it.typeof('string')}]
    })

  //enable multiple versions per run...

  it(parser.parse("--version v0.3.0 hello.node.js --version v0.3.7 hello.node.js".split(' '),dir))
    .has({
     tests: [{version :'v0.3.0', command: it.typeof('string')}, {version :'v0.3.7', command: it.typeof('string')}]
    })

}

exports ['plugins'] = function (){
  it(parser.parse("-plugin require [\"arguments\"] test/arg-parse.node.js".split(' '),dir))
    .has({
      tests: [
        { plugins: [{require: 'require', args: ["arguments"]}]
        }
      
      ]
    })
}

exports ['PACKAGE.JSON is valid'] = function (){
  it(require('../')).property('version',JSON.stringify(require('fs').readFileSync(__dirname + '/../package.json')).version)
}


helper.runSync(exports)