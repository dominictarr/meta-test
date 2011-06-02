
#Meta-Test (alpha)#
##the test framework framework##

Meta-test does everything that every test framework **must** do (reporting, sandboxing) and separates it from the things it  **may** do (the test api). 

Hence meta-test is a standard runner for multiple test frameworks. 

only lightweight adapters are necessary to run any kind of nodejs test, currently expresso, vows, nodeunit, and node tests are supported.

(by 'node' test i mean a simple script which throws an exception if it fails, but has no framework - the simplest kind of test)

current features:

  * run expresso, vows, and nodeunit tests (adapters use a very simple API - easy to add more)
  * run plain node.js scripts which just throw an exception on failure.
  * isolate tests in a separate node process.
  * detect compatibility with node versions by testing in each version (>=0.2.0)
  * test runner detects dependencies & can inject different dependency versions (see -meta and -remaps args)
  * a standard reporting API independent of test framework.

forthcoming:

  * additional test framework adapters,  test-commonjs, qunit, mjsunit etc.
  * browser based testing.
  * plugins to detect code coverage, and monkeypatches.

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

    > meta-test -meta test/test.expresso.js
    
remap dependencies

    > meta-test -remaps '{"request": "/path/to/file.js"}' test/test.expresso.js

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
    , remaps {request, fileToLoadInsteadOf_request
    }, callback)
    
    function callback (err,report){
      //do something with the report!
    }


##Adapter API##

a test adapter needs just one function, `run(tests,reporter,callback)` 
it has just two arguments:

  * `tests`: whatever the unit test exported
  * `reporter`: the meta-test report builder.
  * `callback`: callback when it thinks the test is done.

it must return a shutdown function.

the shutdown function can be used to check that all the tests where run, etc.

the shutdown will be called when the test runner is confidant that the test is complete (i.e. at exit). 
the shutdown function *must* be synchronous. this is to allow for weird problems with async tests. (like accidentially declaring the test done)

see meta-test/adapters for examples of using the Adapter API