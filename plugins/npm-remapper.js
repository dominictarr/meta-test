//logger.js

var Remapper = require('npm-remapper')
  , r = new Remapper (module)

module.exports = NpmRemapperPlugin

function NpmRemapperPlugin (remaps){
  if(!(this instanceof NpmRemapperPlugin )) 
    return new NpmRemapperPlugin (remaps)

  this.remapper = new Remapper (module,remaps || {})
  }

NpmRemapperPlugin.prototype = {
  loadTest: function (path,reporter,fallback){
    console.log("NPM-REMAPPER loadTests",path)
    return this.remapper.require(path)
  }
, loadAdapter: function (path,reporter,fallback){
    console.log("NPM-REMAPPER loadAdapter",path)
    return this.remapper.require(path)
  }
, exit: function (reporter,fallback){
    console.log("NPM-REMAPPER exit")
    console.log(this.remapper.depends)
    console.log(reporter.report)

    reporter.meta('npm-remapper',{ depends: this.remapper.depends })
  }
}