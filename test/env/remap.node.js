//remap.expresso.js


var depends = require('../depends')
  , path = require('path')
  , it = require('it-is')
  depends.remap({'./b': rel('./examples/b2.js')})
  
  function rel(r){
    return path.join(__dirname, r)
/*    var r = path.join(module.id.replace(__filename.replace(__dirname,''),''),rel)
    console.log(r)
    return r*/
  }

exports ['load a different module'] = function (){

  require('./examples/a')
  
  var sorted = depends.sorted(rel('./examples/a.js'))

  it(sorted.map(function (e){return {filename: e.filename}}))
    .has([
      {filename: rel('./examples/d2.js')}
    , {filename: rel('./examples/b2.js')}
    , {filename: rel('./examples/d.js')}
    , {filename: rel('./examples/e.js')}
    , {filename: rel('./examples/c.js')}
    , {filename: rel('./examples/a.js')}
    ])
}

/*how should I handle conflicting dependencies?*/

/*{ requestWithConflict: 
  { '.': newrequest/filename
  , './request1': conflict_request1_for_requestWithConflict }
, './request1': 
  default_for_request }*/
  
  /*
  //x.js
    require('./z')
    require('./y')
  //y.js
    require('./z')

  { './y': 
    { '.': './y'
    , './z': './z2' } }

  //x will load ./z as default.
  //conflicting versions like this will only work when different modules request the same thing (can give them different)
  //can't have two different 'y' with different dependencies. (this could be implemented, but lets ignore it for now)
  
  */
  
exports ['load modules with conflicting versions'] = function (){

  depends.remap({
    './y': 
      { './z': './z2' } 
  })

  require('./examples/x')

  var sorted = depends.sorted(rel('./examples/x.js'))

  it(sorted.map(function (e){return {filename: e.filename}}))
    .has([
      {filename: rel('./examples/z.js')}
    , {filename: rel('./examples/z2.js')}
    , {filename: rel('./examples/y.js')}
    , {filename: rel('./examples/x.js')}
    ])

}

/*next question:
  does this carry through correctly?
  if 
  {'./i' : 
    { '.': './i2'
    , 'k': 'k2' } }
    
  and 
  //h.js
  require('./i')
  
  //i.js
  require('./j')
  /j.js
  require('k') // should get k2 ! this will make it very easy to test npm packages.
*/

exports ['copies remaps to child modules'] = function (){

  depends.remap({
    './i' : {
        '.'   : './i2'
      , './k' : './k2' 
    } 
  })

  require('./examples/h')

  var sorted = depends.sorted(rel('./examples/h.js'))

  it(sorted.map(function (e){return {filename: e.filename}}))
    .has([
      {filename: rel('./examples/k2.js')}
    , {filename: rel('./examples/j.js')}
    , {filename: rel('./examples/i2.js')}
    , {filename: rel('./examples/h.js')}
    ])
}


require('./lib/helper').runSync(exports)