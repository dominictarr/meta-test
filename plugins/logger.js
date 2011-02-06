//logger.js

module.exports = {
  loadTest: function (path,reporter,fallback){
    console.log("LOGGER loadTests",path)
    reporter.meta('loadTest', path)
    return fallback (path,reporter,fallback)
  }
, loadAdapter: function (path,reporter,fallback){
    console.log("LOGGER loadAdapter",path)
    reporter.meta('loadAdapter', path)
    return fallback (path,reporter,fallback)
  }
}