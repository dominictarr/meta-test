
console.log('async error')
process.nextTick(function(){
  throw new Error ('erroring node test script example');
})
//do nothing test.
