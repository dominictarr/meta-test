

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
    + "see https://github.com/creationix/nvm ")

var list = fs.readdirSync(dir).filter(function (e){return /^v\d+\.\d+\.\d+\w*$/(e)}).sort()

var platforms = {}

list.forEach(function (e){
  platforms[e] = path.join(dir, e , 'bin/node')
})
// + '/bin/node


function command (name){
  return platforms[name]
}

exports.list = list
exports.command = command