var timers = {
  getCPU:false,
  getCPUTemp:false,
  getMem:false,
  getNet:false,
  getProcesses:false,
}
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d")
function drawRing(ctx,centerX,centerY,outerRadius,width,startAngle,endAngle,isCounterClockwise,precentage,bgcolor,bgalpha,color,alpha){
  
  if(endAngle<startAngle)
    precentAngle = (360+endAngle-startAngle)*precentage + startAngle
  else
    precentAngle = (endAngle-startAngle)*precentage + startAngle

  precentAngle *= 2*Math.PI/360
  endAngle *= 2*Math.PI/360
  startAngle *= 2*Math.PI/360
  
  ctx.beginPath()
  ctx.arc(centerX,centerY,outerRadius,startAngle,endAngle,isCounterClockwise);
  ctx.arc(centerX,centerY,outerRadius-width,endAngle,startAngle,!isCounterClockwise);
  
  ctx.fillStyle = 'hsla('+bgcolor+',100%,100%,'+bgalpha+')'
  ctx.fill()   
  ctx.beginPath()
  ctx.arc(centerX,centerY,outerRadius,startAngle,precentAngle,isCounterClockwise);
  ctx.arc(centerX,centerY,outerRadius-width,precentAngle,startAngle,!isCounterClockwise);
  
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
      drawRing(ctx,50,50,25+3*7,6,60,360,false,cpu[0]/100,0,0.5,200,0.5)
      drawRing(ctx,50,50,25+2*7,6,60,360,false,cpu[1]/100,0,0.5,200,0.5)
      drawRing(ctx,50,50,25+1*7,6,60,360,false,cpu[2]/100,0,0.5,200,0.5)
      drawRing(ctx,50,50,25+0*7,6,60,360,false,cpu[3]/100,0,0.5,200,0.5)
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
      ctx.clearRect(150-30, 95-30, 30*2, 30*2);
      drawRing(ctx,150,95,30,12,180,90,false,used/total,0,0.5,200,0.5)
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
      if (upChartData.datasets.length > 0) {
            upChartData.datasets[0].data.push(net.tx);
            upChartData.datasets[0].data.splice(0,1);
            window.upBar.update();
        }
      if (dnChartData.datasets.length > 0) {
            dnChartData.datasets[0].data.push(-net.rx);
            dnChartData.datasets[0].data.splice(0,1);
            window.dnBar.update();
        }
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
window.onload = function() {
    var ctxup = document.getElementById("up-chart").getContext("2d");
    var ctxdn = document.getElementById("dn-chart").getContext("2d");
    window.upChartData = {
        labels: ["", "", "", "", "", "", "", "", "", "",
                 "", "", "", "", "", "", "", "", "", ""
                ],
        datasets: [{
            backgroundColor: '#ccc',
            borderWidth: 0,
            data: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        }]

    };
    window.dnChartData = {
        labels: ["", "", "", "", "", "", "", "", "", "",
                 "", "", "", "", "", "", "", "", "", ""
                ],
        datasets: [{
            backgroundColor: '#ccc',
            borderWidth: 0,
            data: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        }]

    };
    window.upBar = new Chart(ctxup, {
        type: 'bar',
        data: upChartData,
        options: {
            responsive: false,
            maintainAspectRatio: false,
            title: {
                display: false,
            },
            legend: {
                display: false,
            },
            animation : false,
            layout: {
                padding: {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                }
            },
            tooltips: {enabled:false},
            scales: {
                yAxes: [{
                    ticks: {
                        // Include a dollar sign in the ticks
                        callback: function(value, index, values) {
                            return '';
                        }
                    },
                    gridLines : {
                      drawBorder: false,
                      display : false
                    }
                }],
                xAxes: [{
                    ticks: {
                        // Include a dollar sign in the ticks
                        callback: function(value, index, values) {
                            return '';
                        }
                    },
                    gridLines : {
                      drawBorder: false,
                      display : false
                    }
                }]

            }
        }
    });
    window.dnBar = new Chart(ctxdn, {
        type: 'bar',
        data: dnChartData,
        options: {
            responsive: false,
            maintainAspectRatio: false,
            title: {
                display: false,
            },
            legend: {
                display: false,
            },
            animation : false,
            layout: {
                padding: {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                }
            },
            tooltips: {enabled:false},
            scales: {
                yAxes: [{
                    ticks: {
                        // Include a dollar sign in the ticks
                        callback: function(value, index, values) {
                            return '';
                        }
                    },
                    gridLines : {
                      drawBorder: false,
                      display : false
                    }
                }],
                xAxes: [{
                    ticks: {
                        // Include a dollar sign in the ticks
                        callback: function(value, index, values) {
                            return '';
                        }
                    },
                    gridLines : {
                      drawBorder: false,
                      display : false
                    }
                }]
            }
        }
    });
    getCPU()
    getCPUTemp()
    getMem()
    getNet()
    getProcesses()
    getCrypto()
};