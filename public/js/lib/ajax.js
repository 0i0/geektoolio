define(function (require) {
  return function ajax(path,cb) {
    var xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function(){
      if (this.readyState == 4 && this.status == 200) {
        cb(null,this.responseText)
      }else{
        cb(true,null)
      }
    }
    xhttp.open('GET', path, true)
    xhttp.send()
  }
})