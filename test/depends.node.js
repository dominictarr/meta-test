//depends.expresso.js

var depends = require('../depends')
  , it = require('it-is')
  , path = require('path')
  
  function relativeId(rel){
    return path.join(__dirname, rel)
/*    var r = path.join(module.id.replace(__filename.replace(__dirname,''),''),rel)
    console.log(r)
    return r*/
  }
  
  function fn(end){
    return it.matches(new RegExp('.*' + end + '$'))
  }

exports ['loads dependencies'] = function (){

  require('./examples/a')

//[ d, b, e, c, a ]

//  depends.logLevels ()

//  console.log(path.join(__dirname,'./examples/a.js'))

  var sorted = depends.sorted(path.join(__dirname,'./examples/a.js')).map(function(e){return {filename: e.filename}})
  console.log()

//  console.log(require.cache[module.id.replace(__filename,'/examples/a')])

  it(sorted)
    .has([
      {filename: fn('examples/d.js')}
    , {filename: fn('examples/b.js')}
    , {filename: fn('examples/e.js')}
    , {filename: fn('examples/c.js')}
    , {filename: fn('examples/a.js')}
    ])

  it(depends.sorted(relativeId('./examples/b.js')))
    .has([
      {filename: fn('examples/d.js')}
    , {filename: fn('examples/b.js')}
    ])

  it(depends.sorted(relativeId('./examples/d.js')))
    .has([
     {filename: fn('examples/d.js')}
    ])

}

exports ['has resolves'] = function (){

  var sorted = depends.sorted(relativeId('./examples/b.js'))

  it(sorted[1].resolves)
    .has({
      './d' : relativeId('./examples/d.js')
    })

  sorted = depends.sorted(relativeId('./examples/a.js'))

  it(sorted[4].resolves)
    .has({
      './b' : relativeId('./examples/b.js')
    , './c' : relativeId('./examples/c.js')
    })

  it(sorted)
    .has([
      {filename: fn('d.js')
      , resolves: {} }
    , {filename: fn('b.js')
      , resolves: {} }
    ])

}

exports ['has depends'] = function (){

  var sorted = depends.sorted(relativeId('./examples/a.js'))
    , d = sorted[0]
    , b = sorted[1]
    , e = sorted[2]
    , c = sorted[3]
    , a = sorted[4]

  it(b.depends)
    .has({
      './d' : it.strictEqual(d)
    })

  it(a.depends)
    .has({
      './b' : it.strictEqual(b).has({
        depends: { './d' : it.strictEqual(d) } 
        } )
    , './c' : it.strictEqual(c).has({
        depends: {
            './d' : it.strictEqual(d)
          , './e' : it.strictEqual(e) }
        } )
    })
}

exports ['require works'] = function (){

  require('./require.expresso').works()
}

require('./lib/helper').runSync(exports)