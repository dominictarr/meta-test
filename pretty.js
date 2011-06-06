//prettyprint test report

var style = require('style')
//  , styleError = require('color').error.styleError
  , render = require('render')
  
var styles = 
    { 'success' : style('green')
    , 'failure' : style('yellow')
    , 'error' : style('red')
    }
var syms = 
    { 'success' : '.'
    , 'failure' : '?'
    , 'error' : '!'
    }

function styleError (error){

  if(!error)
    return '' + error
  if(error.stack)
    return error.stack
  return render(error)
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
function failures(failures){
  if(failures.length)
//    return failures.join('\n')
    return failures.map(styleError).join('\n')
}


function bar (list){
  return list.map(function (e){ return styles[e.status](syms[e.status]) }).join('')
}

function tests(tests){

  return tests.map(function (test){
    return indent ( para
      ( styles[test.status](test.name)
      ,  indent(failures(test.failures) ) 
      ) )
  }).join('\n')
}

function toString(report){
  if(!report.name)
    console.log(report)
  var fn = report.name.replace(process.env.PWD + '/','')
//  console.log(report.version)
  return para
  ( style('node-' + (report.version)).bold
  , styles[report.status](fn) + '    ' + bar(report.tests)
//  , (report.meta && Object.keys(report.meta).length) ? "MetaData:\n" + render(report.meta, {multi: true}) : null
  , failures(report.failures)
  , tests(report.tests)
  )
  
}

function print (report){
  console.log(toString(report))
}

exports.print = print
exports.bar = bar
