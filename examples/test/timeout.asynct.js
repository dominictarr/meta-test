
console.log('async error')

exports ['error'] = function (){
  throw new Error("INTENSIONAL ERROR")
}
exports ['hang'] = function (){
  setInterval(function(){console.log('.')},100)
}
