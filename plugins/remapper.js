//logger.js

var Remapper = require('remap/remapper')
  , r = new Remapper (module)

module.exports = {
  loadTest: function (path,reporter,fallback){
    console.log("REMAPPER loadTests",path)

    return r.require(path)
  }
, loadAdapter: function (path,reporter,fallback){
    console.log("REMAPPER loadAdapter",path)
    return r.require(path)
  }
, exit: function (reporter,fallback){
    console.log("REMAPPER exit")
    console.log(r.depends)
    console.log(reporter.report)

    reporter.meta('remapper',{ depends: r.depends })
  }
}