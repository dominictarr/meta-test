module.exports = Plugin

function Plugin (before,after){
  if(!(this instanceof Plugin)) return new Plugin (before,after)
  this.c = function (x,def){
    return before + def(x) + after
  }
}