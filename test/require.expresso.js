var it = require('it-is')

exports ['works'] = function (){
  
  if(/v0\.2\..*/(process.version)){
    it(require).function().has({
        paths: it.instanceof(Array)
      , async: it.function()
      , main: it.ok()
      , registerExtension: it.function()
    })
  } else if (/v0\.4\..*/(process.version) || /v0\.3\..*/(process.version) ){
    it(require).function().has({
        paths: it.instanceof(Array)
      , main: it.ok()
      , resolve: it.function()
      , cache: it.typeof('object')
      , extensions: it.typeof('object')
    })
  }

}