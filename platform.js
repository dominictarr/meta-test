

//platform.js 

//detect node platforms, for now, 
//this means installed versions of nodejs, 
//in future hopefully this could mean different browsers or 
//other server-side js engines...

//at this stage, just detect all versions of node in $NVM_DIR

var fs = require('fs')
  , path = require('path')
  , dir = process.env.NVM_DIR
  
if(!dir)
  return console.error("could not detect nvm (node version manager) installation.\n"
    + "see https://github.com/creationix/nvm or email dominic.tarr@gmail.com to complain.")

var platforms = {}
var list = fs.readdirSync(dir)
  .filter(function (e){
    if(/^v\d+\.\d+\.\d+\w*$/(e)){
      try {
        var file = path.join(dir,e, 'bin/node')
        fs.statSync(file)
        platforms[e] = file
        return true
      } catch (err) {return false}
    }
  }).sort()

function command (name){
  return platforms[name]
}

exports.list = list
exports.command = command