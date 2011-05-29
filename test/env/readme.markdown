#THESE TESTS HAVE SPECIAL DEPENDENCIES#

#THEY WILL FAIL IF DEPENDENCIES ARE NOT RIGHT#

npm install nvm
nvm install v0.3.1
nvm install v0.3.2

you must run the other tests directily with node

node test/env/depends.node.js
node test/env/remap.node.js
