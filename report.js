

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

Report.prototype = {
  test: function (name,error){
    
  
    if(!this.tests[name]) {
      var test = 
        { name: name
        , failures: arguments.length > 1 ? [error] : []
        , get status (){
            var stat = stati.success
            for(var i in this.failures){
              if(!(this.failures[i] && this.failures[i].name &&  this.failures[i].name == "AssertionError"))
                return stati.error
              else
                stat = stati.failure
            }
            return stat
          }
        }

      this.report.tests.push(this.tests[name] = test)
    } else if (arguments.length > 1)
      this.tests[name].failures.push(error)
  
    return this
  }
, error: function (err){
    this.report.errors.push (err)
    
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
    { filename: filename
    , errors: []
    , os: process.platform
    , version: process.version
    , meta: {}
    , get status (){
        var stat = stati.success
        if(this.errors.length)
          return stati.error
        
        this.tests.forEach(function (e){
          stat = update(stat,e.status)
        })
        return stat
      }
    , tests: [] }
  this.tests = {}
}

