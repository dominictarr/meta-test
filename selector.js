//selector.js 

/*
finds adapter to use from the filename
looks for test-adapters.js or package.json to get rules
was going to have test.json, and eval regexps and functions, 

but it was way more trouble than worth. (eval gives cryptic error messages) (RegExps are okay though)

people won't like having a standard name for test-adapters.js better to read an option in package.js

adapter-rule: [rule]
test-adapters: [rule] //thats the rule
test-adapters: 'file'

new idea: guess adapter from package.json.
after checking file extensions .expresso.js etc
check script: 'expresso test/*.js'
and then check devDependencies, then check dependencies.
*/
//returns [{filename: fn, adapter: a },...]

var easy = require('easyfs')
  , fs = require('fs')
  , inspect = require('sys').inspect
  , adapters = 'expresso,vows,nodeunit,async_testing,asynct,synct,node'.split(',')

exports.select = select 
exports.find = find
exports.findAll = findAll
exports.findAdapter = findAdapter
exports.guess = guess
exports.adapters = adapters
  
function guess (package){

  if(package.scripts && package.scripts.test){
    return adapters.filter(function (e){
      return ~package.scripts.test.indexOf(e)
    }).shift()
  }
  if(package.devDependencies){
    var first = adapters.filter(function (e){
      return package.devDependencies[e]
    }).shift()
    if(first) return first
  }
  if(package.dependencies){
    var first = adapters.filter(function (e){
      return package.dependencies[e]
    }).shift()
    if(first) return first
  }
  return 'node'
}

function select (filename, package) { //returns what adapter to use

  var e = /^.+\.(\w+)\.\w+$/(filename)
  if(e)
    return e[1]
  var g = guess(package)
  if(g)
    return g
  
  return 'node'

//  throw new Error ("could not detect test type for: " + filename)
}

var isRegExp = /\/(.*?)\/([gimy]*)/

function isFunction (string){
  if(!~string.indexOf('function'))
    return
  try {
    var f = eval(string)
    if(f instanceof Function)
      return f
  } catch (err) {
    return
  }
}

function load (file){
  if(!easy.existsSync(file))
    return
  return require(file)
}

function parse (file){
  if(!easy.existsSync(file)){
    return
    }

  var obj = JSON.parse(fs.readFileSync(file,'utf-8'))
    , g
  if(g = guess(obj))
    console.log("GUESSED ADAPTER:", g)

  if(obj['test-adapters']){
    var rules = obj['test-adapters']

    if('string' == typeof rules){
      var local = easy.dir(fs.realpathSync(file))
      if(rules[0] == '.')//relative path
        return require(easy.join(local,rules))
      return require(rules)
      
    }
    rules = rules.map(function (r){
      var e
      if(e = isRegExp(r)){
        var reg = new RegExp(e[1],e[2])
        return new RegExp(e[1],e[2])

      } else if(e = isFunction(r)){
        return e
      }
      return r
    })
    return rules
  }
  return []

}

function recurse (dir){

    var path = easy.join(dir,'package.json')
      , json
    try{
      json = '' + fs.readFileSync(path)
//      console.log(json)
      try{
        return eval ('(' + json + ')')
      } catch (err){
        console.error((err && err.message), 'in :' + path)
      }
    } catch (err){
      //package.json did not exist at that path.
    }

    if(dir &&  dir != '/')
      return recurse(easy.join(dir,'..'))
}

function find(fn,dir){
  var _fn = fn
  if(fn[0] != '/')
    _fn = easy.join(dir,fn)

  return {filename: fn, adapter: select(fn,recurse(_fn))}
}
function findAdapter(file){//should be an
  return find(file,file).adapter//file should be an absolute path
}

function findAll(filenames){
  return filenames.map(function (f){return find(f,process.env.PWD)})
}

