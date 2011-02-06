
/*
pattern for plugins
var sox= 
  new Plugins ({
    name: function default (){}
    })

 // will need to be able to specify the plugins as a path + args 
 // so we can load it in a child process.

  sox
    .add(object) || (path , [constructorArgs])
    .add(...)
    
  then you call sox.hook(args)
  
  and it will call 
  frist plugin(args,next)
  
  the plugin can block earlier plugins
  modify the results or drop through.
  
  function hooked1 (args,default){
    //do something
    //block default    
  }

  function hooked2 (args,default){
    return default(args) //fall through    
  }

*/

module.exports = Plugins

function toAry (args){
  var a = []
  for(var i in args){
    a.push(args[i])  
  }
  return a
}

function Plugins(hooks){

  var plugins = [hooks]
    , self = this

  for(var name in hooks){
    this[name] = makeHook(name)
  }
  this.add = function (plugin){
    plugins.unshift(plugin)
    return this 
  }

  this.load = function (list){
    //load a list of modules and init with provided args
    for(var i in list){
      var plug = list[i]
      var obj = require(plug.require)
      if('function' == typeof obj)
        this.add(obj.apply(null,plug.args || []))
      else
        this.add(obj)    
    }
    return this
  }

  function makeHook (name,j){
    j = j || 0

    return function hooked(){
      var i = j
      while(plugins[i] && !plugins[i][name]){
        i ++
      }

      var args = toAry(arguments)

      if(plugins[i + 1]){
        args.push(makeHook(name,i + 1))
      }
        
      return plugins[i][name].apply(plugins[i],args)
    }
  }
}