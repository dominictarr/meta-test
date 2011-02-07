//prettyprint test report

var style = require('style')
  , styleError = require('style/error').styleError
  , render = require('render')
  
var styles = 
    { 'success' : function (x){return style(x).green}
    , 'failure' : function (x){return style(x).yellow}
    , 'error' : function (x){return style(x).red}
    }
var syms = 
    { 'success' : '.'
    , 'failure' : '?'
    , 'error' : '!'
    }

function para (){
  var s = []
  for(var i in arguments){
    if(arguments[i]/* !== undefined*/)
      s.push(/*'|' + */ arguments[i]/* + '|'*/)
  }
  return s.join('\n')
}
function indent (lines){
//  return lines
  if(lines)
    return lines.split('\n').map(function (e){ return '  ' + e }).join('\n')
}
function errors(errors){
  if(errors.length)
    return errors.map(styleError).join('\n')
}

function bar (list){
  return list.map(function (e){ return styles[e.status](syms[e.status]) }).join('')
}

function tests(tests){

  return tests.map(function (test){
    return indent ( para
      ( styles[test.status](test.name)
      ,  indent(errors(test.failures) ) 
      ) )
  }).join('\n')
}

function toString(report){

  var fn = report.filename.replace(process.env.PWD + '/','')
//  console.log(report.version)
  return para
  ( style('node-' + (report.version)).bold
  , styles[report.status](fn) + '    ' + bar(report.tests)
  , (report.meta && Object.keys(report.meta).length) ? "MetaData:\n" + render(report.meta, {multi: true}) : null
  , errors(report.errors)
  , tests(report.tests)
  )
  
}

function print (report){
  console.log(toString(report))
}

exports.print = print
exports.bar = bar
