//arg-parser.js

var Nihop = require('nih-op')
  , selector = require('./selector')
  , adapter
  , tests = []
  , platform = require('./platform')
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
  , version
  , command

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

  .option('logger','l',1)
  .describe('how to display output .','[pretty|json]')
  .default('pretty')

  .option('version','v',1).do(function (value){
      version = value
      command = platform.command(value)
    if(!command)
      throw ("meta-test does not know node version '" +  version + "' \n"
      + "try one of:\n" + platform.list.join('\n'))
    })
  .describe('node version to test against\n   one of: [' + require('./platform').list.join(',') + ']','[version]')

  .option('timeout','t',1)
  .describe('force test to finish timeout. (default 30 seconds)','[millseconds]')

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
  
  payload.version = version || process.version

  payload.command = command || 'node'
  tests.push(payload)
}

exports.parse = function (args,currentDir){
  pwd = currentDir || pwd 

  var all = {}

  var obj = parser.parse(args)

  all.timeout = obj.timeout
//  all.version = obj.version
//  all.command = obj.version ? require('./platform').command(obj.version) : 'node'

  var r = tests
  tests = []
  r.forEach(function (e){
    e.__proto__ = all
  })
 
  adapter = undefined
  if(obj.depends)
    r.depends = true
  obj.tests = r
  return obj
}