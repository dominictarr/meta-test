
#Meta-Test (alpha)#

current features:

  * run expresso, and nodeunit tests (adapters use a very simple API easy to add more)
  * run plain node.js scripts which just throw an exception on failure.
  * isolate tests in a seperate node process.
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

##Usuage##

basic

    > meta-test -expresso test/an-expresso-test.js //run an expresso test etc.
    > meta-test -nodeunit test/an-expresso-test.js //run an nodeunit test etc.
    > meta-test -node test/script.js //a script which throws an exception & exits on fail or error.

set node version

    > meta-test -version v0.3.8 test/test.expresso.js
    
detect dependencies

    > meta-test -plugin ./plugin/npm-remapper [] test/test.expresso.js
    
remap dependencies

    > meta-test -plugin ./plugin/npm-remapper [{\"package\":\"x.y.z\"}] test/test.expresso.js

    //plugin option takes to args. path to the plugin, then arguments to to plugin in json.
    //to remap versions: [[{packagename: version}] (as many remaps as you like, must be vaild JSON.
    
##detecting test adapters.##

###the easy way: <strong> use my convention </strong> ###

append .[adapter].js to your test filenames.

    test/test1.expresso.js   //an expresso test
    test/test2.nodeunit.js   //an nodeunit test
    test/test3.synct.js      //like simplified expresso, sync functions only.
    test/test4.asynct.js     //like simplified nodeunit/async_testing, must declare when test is completed.
    
###the less easy way:###

meta-test will recursively search ./ , ../ ,  ../../ , etc looking for a package.json.
if the json it finds has an property test-adapters: ['adapter'] //note adapter must be in an array.




meta-test is a framework for writing compatible unit test frameworks.

it handles running, reporting, and structure of the report, and interface between meta-test and an actual test is provided
by an adapter

##Adapter API##

a test adapter needs just one function, `run(tests,reporter)` it's two arguments are the exports module of the unit test, 
and the report builder. it must also return a shutdown function, which will be called when the test runner is confidant that the test is complete (i.e. at exit). the shutdown function must be syncronous.

that is all.

##Adapter Detection##

meta-test needs to know what test adapter to use, meta-test will search recurively through parent directories
looking for package.json or tests.json

"test-adapter":"expresso" //if all your tests use a one adapter

//regular expression to full adapter from first group in match
"test-adapter": '/^.+\.(\w+)\.\w+$/' 
//this expression would match 
//filename.adapter.js and return adapter
//this is the default

//explicitly match filenames to adapters.
"test-adapter": {filename: adapter}

ARGH write stuff here.