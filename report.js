

module.exports = Report

var stati = 
    { started: 'started'
    , success: 'success'
    , failure: 'failure'
    ,   error: 'error' }
  , order = [stati.success, stati.failure, stati.error]
  , assert = require('assert')

Report.status = stati

function update(old, newer){
  var o = order.indexOf(old)
    , n = order.indexOf(newer)
    
    return order[o > n ? o : n]
}

function min (array,func){
  var m = 'success'
  for(var i in array){
    var n = func(array[i],i,array)
    if(n && n < m)
      m = n
  }
  return m
}

function getStatus (array){
  return min(array,function (e){
    if(e && e.name && e.name === "AssertionError")
      return stati.failure
    return stati.error
  })
}

Report.prototype = {
  test: function (name,error){

    if(!this.tests[name]) {
      var test = 
        { name: name
        , failures: arguments.length > 1 ? [error] : []
        , get status (){
            return getStatus(this.failures)
          }
        }

      this.report.tests.push(this.tests[name] = test)
    } else if (arguments.length > 1)
      this.tests[name].failures.push(error)
  
    return this
  }
, error: function (err){
    this.report.failures.push (err)
    
    return this
  }
, meta: function (key,value){
    this.report.meta[key] = value
    
    return this
  }
}

function Report (filename){
  if(!(this instanceof Report)) return new Report(filename)
  this.report = 
    { name: filename
    , filename: filename
    , failures: []
    , os: process.platform
    , version: process.version
    , meta: {}
    , get status (){
        var m = getStatus(this.failures),
          n = min(this.tests,function (e){return e.status})
          return n < m ? n : m
      }
    , tests: [] }
  this.tests = {}
}