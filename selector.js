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

*/
//returns [{filename: fn, adapter: a },...]

var easy = require('easyfs')
  , log = require('logger')
  , fs = require('fs')

exports.select = select 

function select (filename, rules) { //returns what adapter to use

  for(var i in rules){
    var rule = rules[i]
    if(rule instanceof RegExp){
      var match = rule(filename)
      if(match)
        return match[1]
    }
    if('string' === typeof rule)
      return rule
    if('function' === typeof rule){
      var match = rule(filename)
        if(match)
      return match      
    }
    if('object' === typeof rule){
        if(rule[filename])
      return rule[filename]
    }

    //of couse you can't json regexp's or functions so they will have to be evaled, if they match 
  }

  //if we're still here, apply the default rule:
  var e = /^.+\.(\w+)\.\w+$/(filename)
  if(e)
    return e[1]
  throw new Error ("could not detect test type for: " + filename + ", with rules" + rules)
}

exports.find = find

var isRegExp = /\/(.*?)\/([gimy]*)/

function isFunction (string){
  if(!~string.indexOf('function'))
    return
  try{
    var f = eval(string)
    if(f instanceof Function)
      return f
  } catch (err){
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
  console.log("FOUND!")

  var obj = JSON.parse(fs.readFileSync(file,'utf-8'))

  if(obj['test-adapters']){
    var rules = obj['test-adapters']
    log(rules)

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
        console.log(reg, typeof reg, reg instanceof RegExp)
        return new RegExp(e[1],e[2])

      } else if(e = isFunction(r)){
        console.log(e.toString(), typeof e)
        return e
      }
      return r
    })
    log(rules)
    return rules
  }
  console.log("NO RULES")
  return []

}

function recurse (dir){

    var pJson = easy.join(dir,'package.json')
    log("RECURSE",pJson)
    var adapter
    if(adapter = parse(pJson)){
      return adapter
    }

    if(dir)
      return recurse(easy.join(dir,'..'))
}
  
function find(filenames){
  log('FILENAMES',filenames)
  return filenames.map(function (fn){
    var _fn = fn
    if(fn[0] != '/')
      _fn = easy.join(process.env.PWD,fn)//here XXX
    var rule = recurse(_fn)
    
    log("RULES:",rule)
  
    return {filename: fn, adapter: select(fn,rule)}
  
  })

}




