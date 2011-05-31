//arg-parser.js

var Nihop = require('nih-op')
  , selector = require('./selector')
  , adapter
  , tests = []
  , platform = require('./platform')
  , versions = platform.list || []
  , version = require('./runner').version
  , parser = new Nihop("meta-test [opts/files]\n", "~~~ Meta-Test (" + version + ") ~~~\n\n  for additional docs see:\n  http://github.com/dominictarr/meta-test\n")
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
  , plugins = []

  parser
  .option('search','s',0).do(function (){
      adapter = undefined
    })
  .describe('search for test adapter from filename / package.json')

  .option('meta','m',0)
  .describe('display extra test information (i.e. dependencies of tests)')

  .option('remaps','r',1).do(function (value){
      remaps = value
    })
  .describe('remap modules {from: to,...}', '[json]').do(function (value){
      try{
      remaps = JSON.parse(value)
      } catch (error){
        error.message += "could not parse '" + value + "'"
        throw error
      }
    })
/*  .option('to','t',1).do(function (value){
      remaps = remaps || {}
      if(!remapFrom)
        throw "got --to " + value + " but did not have a -remap X"
      remaps[remapFrom] = value
    })
  .describe('...to this','[to]')*/

  .option('plugin','p',2).do(function (value){

      try{
      var args = JSON.parse(value[1])
      } catch(err){
        err.message = "could not 2nd argument to --plugin : '" +  value[1] + "' is not valid JSON"
        throw err
      }
      plugins.push({require: value[0], args: args})
    })
  .describe('plugin to use (arguments is array in JSON format)','[plugin require] [arguments]')

  .option('unmap','u',0).do(function (value){
      remaps = undefined
    })
  .describe('stop remapping modules.')

  .option('logger','l',1)
  .describe('how to display output .','[pretty|object|json]')
  .default('pretty')

  .option('version','v',1).do(function (value){
      version = value
      command = platform.command(value)
    if(!~versions.indexOf(value))
      console.log("meta-test does not know node version '" +  version + "' \n"
      + "try one of:\n" + versions.join('\n'))
    })
  .describe('node version to test against\n   one of: [' + versions.join(',') + ']','[version]')

  .option('timeout','t',1)
  .describe('force test to finish within time. (default is 30 seconds)','[millseconds]')

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
    payload.remaps = remaps //JSON.parse(remaps)
  if(plugins.length)
    payload.plugins = plugins
  
  payload.version = version || process.version

  payload.command = command || 'node'
  tests.push(payload)
}

exports.parse = function (args,currentDir){
  pwd = currentDir || pwd 

  var all = {}

  var obj = parser.parse(args)

  all.timeout = obj.timeout

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