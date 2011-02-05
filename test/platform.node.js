//platform.node.js

var it = require('it-is')
  , helper = require('../helper')
  , platform = require('../platform')
  , fs = require('fs')
exports ['check nvm is installed'] = function (){

  it(process.env).property('NVM_DIR',it.typeof('string'), "nvm is not installed")
  
}

/**
  since platforms interactions with the OS there isn't much I can learn from a test.
  the test would need to mock the os, which is not convienent yet.
*/

exports ['commands actually exist'] = function (){
  
  it(platform)
    .has({
      list: it.instanceof(Array)
    , command: it.function()
    })

  it(platform.list)
    .every(function (a){fs.statSync(platform.command(a))})
}


helper.runSync(exports)