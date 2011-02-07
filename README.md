
#Meta-Test (alpha)#

  Meta-test doesn't just run tests, it runs <i>experiments</i>. tests can be run in different node versions,
  and with different dependency versions. detecting compatibility with the coding eco-system.
  
  meta-test is currently alpha status. please contact me for any questions!

current features:

  * run expresso, and nodeunit tests (adapters use a very simple API easy to add more)
  * run plain node.js scripts which just throw an exception on failure.
  * isolate tests in a separate node process.
  * detect compatibility with node versions by testing in each version (>=0.2.0)
  * test runner plugin to detect npm dependencies & test with different dependency versions (with node >= 0.3.0)
  * a standard reporting API independent of test framework.

forthcoming:

  * additional test framework adapters,  vows, test-commonjs, qunit, mjsunit etc.
  * browser based testing.
  * aggregate test results to reports on compatibility with platform (node,browser) versions, and dependency versions.
  * plugins to detect code coverage, and monkeypatches.
  * cloud service to run tests, 
  * full test reports for every npm package across node & dependency versions

##Support##

this is the alpha release of an ambitious project. Any problems, please do not hesitate to log a issue, email me (dominic.tarr@gmail.com) or find me in #node.js on irc.freenode.net

##Usuage##

basic

    > meta-test -expresso test/an-expresso-test.js   //run an expresso test etc.
    > meta-test -nodeunit test/an-expresso-test.js   //run an nodeunit test etc.
    > meta-test -node test/script.js                 //a script which throws an exception & exits on fail or error.

set node version of test process. will detect node versions installed by nvm.

    > meta-test -version v0.3.8 test/test.expresso.js
    
detect dependencies

    > meta-test -plugin ./plugin/npm-remapper [] test/test.expresso.js
    
remap dependencies

    > meta-test -plugin ./plugin/npm-remapper [{\"package\":\"x.y.z\"}] test/test.expresso.js

`-plugin` option takes two arguments. path to the plugin, then arguments to to plugin in json.
to remap versions: `[[{packagename: version}]` (as many remaps as you like, must be vaild JSON)
    
    
for more information use `meta-test --help`

##detecting test adapters.##

###the easy way: <i> use my convention </i> ###

append `.[adapter].js` to your test filenames.

    test/test1.expresso.js   //an expresso test
    test/test2.nodeunit.js   //an nodeunit test
    test/test3.synct.js      //like simplified expresso, sync functions only.
    test/test4.asynct.js     //like simplified nodeunit/async_testing, must declare when test is completed.
    
###the less easy way:###

meta-test will recursively search `./` , `../` ,  `../../` , etc looking for a `package.json`.
if the json it finds has an property `"test-adapters": ['adapter']` (note adapter must be in an array)


##Test Runner API##

to use npm to run tests programmaticially:

    var meta = require('meta-test')
    
    meta.run({
    //mandatory
      filename: pathToTest //will need to be relative to meta-test/runner or absolute
    , adapter: nameOfAdapter // something from meta-test/adapters directory
    //optional
    , timeout: maxTimeInMilliseconds //defaults to 30e3 (30 seconds)
    , plugins: [{
        { require: toToPlugin //i.e. './plugins/npm-remapper'
        , args: [{package: version}] //remap version of package (optional)
        } 
      }]
    }, callback)
    
    function callback (err,report){
      //do something with the report!
    }


##Adapter API##

a test adapter needs just one function, `run(tests,reporter)` it's two arguments are the exports module of the unit test, 
and the report builder. it must also return a shutdown function, which will be called when the test runner is confidant that the test is complete (i.e. at exit). the shutdown function must be synchronous.

example of a very simple testing api for sync tests:

    exports.run = function (tests,reporter){
    
      for(var name in tests){
        reporter.test(name) //log that the test has begun
        try{
          tests[name]()//run each test      
        } catch (error){
          reporter.test(name,error) //log the error     
        }
        //an async error will crash the process, but meta-test will catch it by scraping stderr!
      }
    
      return function (){
        //check that all tests are finished without errors
        //this function will be called just before the test process exits.
      }
    
    }
