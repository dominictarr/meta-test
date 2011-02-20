var helper = require('./lib/helper')
  , it = require('it-is')
  , Plugins = require('../plugins')

exports ['plugins calls default'] = function (){
  var plugins = 
    new Plugins ({hook: function default1(){return 10}})
  it(plugins).property('hook',it.function())
  
  it(plugins.hook()).equal(10)
}

exports ['plugins calls added module first'] = function (){
  var incrementor = 
    { hook: function plugged(fallback){
        return fallback() + 1
      }
    }

  var plugins = 
    new Plugins ({hook: function default2(){return 10}})
    .add(incrementor)

  it(plugins).property('hook',it.function())
  it(plugins.hook()).equal(11)
  
  plugins 
    .add(incrementor)

  it(plugins.hook()).equal(12)

  plugins 
    .add(incrementor)

  it(plugins.hook()).equal(13)
}

exports ['3 let absent hooks fall through'] = function (){

  var plug1 = 
      { a: function doubleVal (val,def){
          return def(0) + (val * 2)
        }
      }
    , plug2 = {
        b: function sayHelloThere(name,def){
          return 'Hello There, ' + name + '!'
        }  
      }

  var plugins = 
    new Plugins ({
        a: function return10(val){return 10 + val}
      , b: function sayHello(name){return "Hello, " + name}
      })

  it(plugins.a(7)).equal(17)
  it(plugins.b("Jim")).equal("Hello, Jim")

  plugins 
    .add(plug1)

  it(plugins.a(7)).equal(24)
  it(plugins.b("Jim")).equal("Hello, Jim")

  plugins 
    .add(plug2)

  it(plugins.a(7)).equal(24)
  it(plugins.b("Jim")).equal("Hello There, Jim!")

}

exports ['plugins.load'] = function (){

  var plugins = 
    new Plugins ({
        a: function return10(val){return 10 + val}
      , b: function sayHello(name){return "Hello, " + name}
      , c: function returnValue(name){return name}
      }).load([
        {require: "./test/dummy-plugins/dummy1"}
      , {require: "./test/dummy-plugins/dummy2"}
      , {require: "./test/dummy-plugins/dummy3", args: ["<before>","<after>"]}
      ])

  it(plugins.a(7)).equal(24)
  it(plugins.b("Jim")).equal("Hello There, Jim!")
  it(plugins.c("CENTER")).equal("<before>CENTER<after>")

  

}

helper.runSync(exports)
