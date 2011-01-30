module.exports = 
  [ /^.*?test-(\w+)-\w+\.\w+$/
  , function (filename) { 
      if( -1 != filename.indexOf ("testSomethingAsync.js"))
        return 'asynct'
      }
  , /^.*\.(\w+)\.\w+$/
  , "node" ]

