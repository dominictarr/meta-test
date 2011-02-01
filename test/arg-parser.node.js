//arg-parser.node.js

var helper = require('../helper')
  , it = require('it-is')
  , parser = require('../arg-parser')
  , path = require('path')
function parse(cmd,dir){

  var parsed = 
   parser.parse(cmd.split(' '),dir)
 
 return function (list){
  it(parsed.tests)
    .deepEqual(
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
  ( [ {filename:'./arg-parser.node.js', adapter: 'node'} ] )  

  parse('-node arg-parser.js -expresso test-something.js',dir + '/test')
  ( [ {filename:'./arg-parser.js', adapter: 'node'}
    , {filename:'./test-something.js', adapter: 'expresso'}
    ] )  

  parse('-node arg-parser.js -expresso test-something.js',dir + '/test')
  ( [ {filename:'./arg-parser.js', adapter: 'node'}
    , {filename:'./test-something.js', adapter: 'expresso'}
    ] )  

}

exports ['detect adapter'] = function (){

  parse('test/arg-parse.node.js examples/test/simple.vows.js',dir)
  ( [ {filename:'test/arg-parse.node.js', adapter: 'node'}
    , {filename:'examples/test/simple.vows.js', adapter: 'vows'}
    ] )
}

/*
remaps
-remap from -> to
-noremapc
*/

exports ['remaps'] = function (){

  parse('--remap a.js --to b.js test/arg-parse.node.js',dir)
  ( [ {filename:'test/arg-parse.node.js', adapter: 'node', remap: {"a.js": "b.js" } }
    ] )

  parse('-r a.js -t b.js test/arg-parse.node.js examples/test/simple.vows.js -u examples/test/simple.nodeunit.js',dir)
  ( [ {filename:'test/arg-parse.node.js', adapter: 'node', remap: {"a.js": "b.js" } }
    , {filename:'examples/test/simple.vows.js', adapter: 'vows', remap: {"a.js": "b.js" } }
    , {filename:'examples/test/simple.nodeunit.js', adapter: 'nodeunit'}
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
}


helper.runSync(exports)