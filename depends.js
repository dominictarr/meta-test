//depends.js

/*
hook require to control module loading.

this is completely insane and ugly except that it actually works.

*/

/*
I've figured out a WAY better way to do this.

first of all, my following module.parent you can see where you are, in shims or not.

also, you can access Module by looking at Module.constructor

of couse you can't change the function like this, but you can access it's properties.

i could load a different module by:

in 0.2.x:

redefining module.constructor.prototype._loadScript & ._loadScriptSync

in 0.3.x:

redefining require.extensions['.js']

you can't get at resolve, but thats a messy way to deal with this problem.

better to locate each versioned file and redirect there, changing the module ID if you really gotta.


what should I start with? 

i mean, whats the most important features, and thier uses?

get sorted dependencies (browserfi)

remap a dependency (test different versions)

detect dependency hash/git repo, path position/ version etc.

cannonical dependency sort order:
order of dependency, then order required.

//a.js
require('b')
require('c')

//b.js
require('d')
//c.js
require('d')
require('e')

//sorted:
[ d, b, e, c, a ]

1. detecting topological order.
1. detecting dependency tree.
2. get hash of file...
3. remap/wrap a file.
4. make sure it works with coffee script.

dependency report. (copy depends and filename, source hash etc from module)

*/
if(module.constructor.prototype._depends)
  return module.constructor.prototype._depends
else 
  module.constructor.prototype._depends = exports

var allSorted = exports.allSorted = []
var levels = {}
var cache = module.constructor.prototype.__filenameCache = {}

var __compile = 
  module.constructor.prototype._compile
  module.constructor.prototype._remaps = {}
  module.constructor.prototype._preRequire = function (old){
    if('object' == typeof this._remaps[old])
      this._newRemaps = this._remaps[old]
    else if (this.hasOwnProperty ('_remaps'))
      this._newRemaps = this._remaps
      var r = this._remaps[old] ? ('object' == typeof this._remaps[old] ? this._remaps[old]['.'] || old : this._remaps[old]) : old
    return r
  }
  
  module.constructor.prototype._postRequire = function (exp,request){
  
        for(var fn in this.__filenameCache){
        if(exp === this.__filenameCache[fn].exports){
          this.resolves[request] = this.__filenameCache[fn].filename
          break;
        }
      }
      delete this._newRemaps /*is set inside module._preRequire()*/
    return exp
  }
  
  module.constructor.prototype.__defineGetter__('depends', function (){
    var d = {}
    for(var i in this.resolves){
      d[i] = cache[this.resolves[i]]
    }
    return d
  })
  
  function countParents(module){
    if(module.parent)
      return countParents(module.parent) + 1
    return 0
  }
  var wrapper =
  (function (exports,require,module,__filename,__dirname){
    /*completely insane hack to remap module loading*/
    var __require = require
    require = function (request){
      return  module._postRequire(__require(module._preRequire(request)),request)
    }
    require.__proto__ = __require
     return (function (exports,require,module,__filename,__dirname){
      //PUTCODEHERE
      }).apply(exports,[exports,require,module,__filename,__dirname])
    }).toString().split('\n')

  wrapper.shift()
  wrapper.pop()
  wrapper = wrapper.join(';').replace(/\s+/g,' ')
 
      
  function wrap(contents){
    
    contents = contents.replace(/^\s*#\!/,'//#!')
    var w = wrapper.split(/\/\/PUTCODEHERE/).join(contents)
    return w
  }
  
module.constructor.prototype._compile = function (contents,filename){
  var level = countParents(this)

  levels[level] = levels[level] || []
  levels[level].push(this.id)

  this.resolves = {}
  cache[this.filename] = this
  this.source = contents
  if(this.parent){
    if(this.parent._newRemaps)
      this._remaps = this.parent._newRemaps //allows loading conflicting versions. _newRemaps is set at require, and removed after.

    this.parent.children = this.parent.children || []
    this.parent.children.push(this)
  }
  var c = __compile.call(this,wrap(contents),filename)
  return c
}

exports.sorted = function (id){

  if(!cache[id]){
    throw new Error("looking for module:'" + id + "'\nexpected one of:\n" + Object.keys(cache).join('\n'))
  }

  return recurse(cache[id],[])

  function recurse(mod,topo){
    mod.children.forEach(function (e){
      recurse(e,topo)
    })
    topo.push(mod)
    return topo
  }
}

exports.remap = function (maps){
  module.constructor.prototype._remaps = maps
}

//  console.log(module.constructor.prototype._depends)

