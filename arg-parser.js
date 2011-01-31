//arg-parser.js

var Nihop = require('nih-op')
  , selector = require('./selector')
  , adapter
  , tests = []
  , parser = new Nihop("meta-test [opts/files]\n", "~~~ Meta-Test ~~~\n\n  for additional docs see:\n  http://github.com/dominictarr/meta-test\n")
  , pwd = process.env.PWD
  , path = require('path')
  , adapters = 
    { 'node' : 'simple node test script (crash at assertion fail)'
    , 'expresso': 'use expresso test framework'
    , 'asynct' : 'use async_testing test framework'
    , 'synct' : 'use synct test adapter'
    , 'vows' : 'use vows'
    , 'nodeunit': 'use nodeunit' }
  , remaps
  , remapFrom
parser
  .option('search','s',0).do(function (){
    adapter = undefined
  })
  .describe('search for test adapter from filename / package.json')
  .option('depends','d',0)
  .describe('display dependencies of tests')
  .option('remap','r',1).do(function (value){
    remapFrom = value
  })
  .describe('remap a module/package from this...', '[from]')
  .option('to','t',1).do(function (value){
    remaps = remaps || {}
    if(!remapFrom)
      throw "got --to " + value + " but did not have a -remap X"
    remaps[remapFrom] = value
  })
  .describe('...to this','[to]')
  .option('unmap','u',0).do(function (value){
    remaps = undefined
  })
  .describe('stop remapping modules.')
  .arg(addTest)
  
  Object.keys(adapters).forEach(function (e){
    parser
      .option(e,e)
      .do(setAdapter)
      .describe(adapters[e])      
  })
  
function setAdapter(bool,option){
  adapter = option.long    
}

function addTest (test){
  test = path.join(pwd,test)
  var payload
  if(adapter)
    payload = {filename: test, adapter: adapter }
  else 
    payload = selector.find(test,pwd)
  if(remaps)
    payload.remap = remaps
  
  tests.push(payload)
}

exports.parse = function (args,currentDir){
  pwd = currentDir || pwd 

  var obj = parser.parse(args)
  var r = tests
  tests = []
  adapter = undefined
  if(obj.depends)
    r.depends = true
  return r
}