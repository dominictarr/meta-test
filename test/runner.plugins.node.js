//runner.plugins.node.js

//load runner with plugins which can change the default behaviour.

/*

runner.run({filename: FN, adapter: A, 
    plugins: [
      { require: path
      , args: [ARGUMENTS] }
    ]
  }, callback )

*/

// that wraps all tests and records meta data abouts them.
// add meta(key,content) to report (allows plugins to add arbitary data to test report)
// the key lets you overwrite it later.

/*
hooks:

loadTests(testRequire,reporter,fallback)
loadAdapter(adapterRequire,reporter,fallback)
post shutdown
(don't allow plugins to block adapter shutdown but will tell them when it's happening).

then command line interface.

maybe ignore test directory for NpmMapper

this could all be done tomorrow!

*/ 
