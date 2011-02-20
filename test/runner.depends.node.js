
var helper = require('./lib/helper')
  , runner = require('../runner')
  , it = require('it-is')

exports ['depends'] = function (finish){

  runner.run({filename: __dirname + '/examples/a.js', adapter: 'node'},check)
  
  function check(err,report){
    console.log(report.meta.depends)

    it(report.meta.depends)
      .instanceof(Array)

    it(report.meta.depends).has([
      {filename: __dirname + '/examples/d.js'}
    , {filename: __dirname + '/examples/b.js'}
    , {filename: __dirname + '/examples/e.js'}
    , {filename: __dirname + '/examples/c.js'}
    , {filename: __dirname + '/examples/a.js'}
    ])

    finish()
  }
}
var xports = {}
exports ['remaps'] = function (finish){

  runner.run({
    filename: __dirname + '/examples/a.js'
  , adapter: 'node'
  , remaps: {'./b':'./b2', './d':'./d2'}
  },check)
  
  function check(err,report){

    console.log(report.meta)

    it(report.meta.depends)
      .instanceof(Array)

    it(report.meta.depends).has([
      {filename: __dirname + '/examples/d2.js'}
    , {filename: __dirname + '/examples/b2.js'}
    , {filename: __dirname + '/examples/e.js'}
    , {filename: __dirname + '/examples/c.js'}
    , {filename: __dirname + '/examples/a.js'}
    ])

    finish()
  }
}

helper.runAsync(exports)