
#meta-test#

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





