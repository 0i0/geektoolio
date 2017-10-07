var timers = {
  getCPU:false,
  getCPUTemp:false,
  getMem:false,
  getNet:false,
  getProcesses:false,
}
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d")
function drawRing(ctx,centerX,centerY,outerRadius,width,startAngle,endAngle,precentage,bgcolor,bgalpha,color,alpha){
  
  precentAngle = (endAngle-startAngle)*precentage + startAngle
  precentAngle *= 2*Math.PI/360
  endAngle *= 2*Math.PI/360
  startAngle *= 2*Math.PI/360
  
  ctx.beginPath()
  ctx.arc(centerX,centerY,outerRadius,startAngle,endAngle,false);
  ctx.arc(centerX,centerY,outerRadius-width,endAngle,startAngle,true);
  
  ctx.fillStyle = 'hsla('+bgcolor+',100%,100%,'+bgalpha+')'
  ctx.fill()   
  ctx.beginPath()
  ctx.arc(centerX,centerY,outerRadius,startAngle,precentAngle,false);
  ctx.arc(centerX,centerY,outerRadius-width,precentAngle,startAngle,true);
  
  ctx.fillStyle = 'hsla('+color+',100%,70%,'+alpha+')'
  ctx.fill()   
}
function makeTable(data,id){
  var dictionaryData = data;
  var table = document.getElementById(id);
  for (var i in dictionaryData) {
    var tr = document.createElement("tr");
    
    for (var j in dictionaryData[i]) {
      var txt = document.createTextNode(dictionaryData[i][j]);
      var td = document.createElement("td");
      td.appendChild(txt);
      tr.appendChild(td);
    }
    table.appendChild(tr);
  } 
}

function ajax(path,cb) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200) {
      cb(null,this.responseText)
    }else{
      cb(true,null)
    }
  }
  xhttp.open("GET", path, true);
  xhttp.send();
}
function getCPU(){
  ajax('/pcpu',function(err,data) {
      clearTimeout(timers.getCPU);
      timers.getCPU = setTimeout(getCPU,1000)
      if(err)
        return
      cpu = JSON.parse(data)
      //document.getElementById("cpu-data").innerHTML = cpu[0] +' '+cpu[1] +' '+cpu[2] +' '+cpu[3];
      ctx.clearRect(50-55, 50-55, 55*2, 55*2);
      drawRing(ctx,50,50,25+3*7,6,60,360,cpu[0]/100,0,0.5,200,0.5)
      drawRing(ctx,50,50,25+2*7,6,60,360,cpu[1]/100,0,0.5,200,0.5)
      drawRing(ctx,50,50,25+1*7,6,60,360,cpu[2]/100,0,0.5,200,0.5)
      drawRing(ctx,50,50,25+0*7,6,60,360,cpu[3]/100,0,0.5,200,0.5)
      status.getCPU=false;
      
  })
}
function getCPUTemp(){
  ajax('/cputemp',function(err,data) {
      clearTimeout(timers.getCPUTemp);
      timers.getCPUTemp = setTimeout(getCPUTemp,1000)
      if(err)
        return      
      var cputemp = parseInt(data)
      document.getElementById("cputemp-data").innerHTML = cputemp +'°';
      
  })
}
function getMem(){
  ajax('/mem',function(err,data) {
      clearTimeout(timers.getMem);
      timers.getMem = setTimeout(getMem,1000)
      if(err)
        return
      mem = JSON.parse(data)
      var used = Math.round((mem.total-mem.free)/1024/1024/1024*100)/100
      var total = Math.round((mem.total)/1024/1024/1024*100)/100
      document.getElementById("mem-data").innerHTML =  used+ ' Gb of ' +total +' Gb'
      
  })
}
function getNet(){
  ajax('/net',function(err,data) {
      clearTimeout(timers.getNet);
      timers.getNet = setTimeout(getNet,1000)
      if(err)
        return
      net = JSON.parse(data)
      document.getElementById("netup-data").innerHTML = net.tx + 'KB'
      document.getElementById("netdn-data").innerHTML = net.rx + 'KB'
      
  })
}
function getProcesses(){
  ajax('/ps',function(err,data) {
      clearTimeout(timers.getProcesses);
      timers.getProcesses = setTimeout(getProcesses,1000)
      if(err)
        return
      parser = new DOMParser()
      document.getElementById("ps-tbody").innerHTML = ""
      // table = parser.parseFromString(data, "text/xml").firstChild
      // document.getElementById("ps-data").appendChild(table)
      makeTable(JSON.parse(data),'ps-tbody')
  })
}
function getCrypto(){
  ajax('/crypto',function(err,data) {
      clearTimeout(timers.getCrypto);
      timers.getCrypto = setTimeout(getCrypto,1000)
      if(err)
        return
      document.getElementById("crypto-body").innerHTML = ""
      makeTable(JSON.parse(data),'crypto-body')
  })
}
function updateStats(){
  getCPU()
  getCPUTemp()
  getMem()
  getNet()
  getProcesses()
  getCrypto()
}
updateStats()