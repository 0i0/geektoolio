define(function (require) {
  var drawRing = require('lib/ring')
    , ajax = require('lib/ajax')
    , makeTable = require('lib/makeTable')

  function getCPU(){
    ajax('/pcpu?_=' + new Date().getTime(),function(err,data) {
      clearTimeout(window.timers.getCPU)
      window.timers.getCPU = setTimeout(getCPU,window.refreshrate)
      if(err)
        return
      var cpu = JSON.parse(data)
      window.ctx.clearRect(50-55, 50-55, 55*2, 55*2)
      for (var i = cpu.length - 1; i >= 0; i--) {
        drawRing(window.ctx,50,50,25+i*7,6,30,330,false,cpu[i]/100,0,0.5,200,0.5)
      }
      status.getCPU=false
    })
  }
  function getCPUTemp(){
    ajax('/cputemp?_=' + new Date().getTime(),function(err,data) {
      clearTimeout(window.timers.getCPUTemp)
      window.timers.getCPUTemp = setTimeout(getCPUTemp,window.refreshrate)
      if(err)return      
      var cputemp = parseInt(data)
      document.getElementById('cputemp-data').innerHTML = cputemp +'°'
        
    })
  }
  function getMem(){
    ajax('/mem?_=' + new Date().getTime(),function(err,data) {
      clearTimeout(window.timers.getMem)
      window.timers.getMem = setTimeout(getMem,window.refreshrate)
      if(err)
        return
      var mem = JSON.parse(data)
      var used = Math.round((mem.total-mem.free)/1024/1024/1024*100)/100
      var total = Math.round((mem.total)/1024/1024/1024*100)/100
      document.getElementById('mem-data').innerHTML =  used+ 'G/' +total +'G'
      window.ctx.clearRect(150-30, 95-30, 30*2, 30*2)
      drawRing(window.ctx,150,95,30,12,90,180,true,used/total,0,0.5,200,0.5)
    })
  }
  function getNet(){
    ajax('/net?_=' + new Date().getTime(),function(err,data) {
      clearTimeout(window.timers.getNet)
      window.timers.getNet = setTimeout(getNet,window.refreshrate)
      if(err)
        return
      var net = JSON.parse(data)
      document.getElementById('netup-data').innerHTML = net.tx + 'KB'
      document.getElementById('netdn-data').innerHTML = net.rx + 'KB'
      if (window.upChartData.datasets.length > 0) {
        window.upChartData.datasets[0].data.push(net.tx)
        window.upChartData.datasets[0].data.splice(0,1)
        window.upBar.update()
      }
      if (window.dnChartData.datasets.length > 0) {
        window.dnChartData.datasets[0].data.push(-net.rx)
        window.dnChartData.datasets[0].data.splice(0,1)
        window.dnBar.update()
      }
    })
  }
  function getProcesses(){
    ajax('/ps?_=' + new Date().getTime(),function(err,data) {
      clearTimeout(window.timers.getProcesses)
      window.timers.getProcesses = setTimeout(getProcesses,window.refreshrate)
      if(err)
        return
      var parser = new DOMParser()
      document.getElementById('ps-tbody').innerHTML = ''
      makeTable(JSON.parse(data),'ps-tbody')
    })
  }
  function getCrypto(){
    ajax('/crypto?_=' + new Date().getTime(),function(err,data) {
      clearTimeout(window.timers.getCrypto)
      window.timers.getCrypto = setTimeout(getCrypto,window.refreshrate)
      if(err)
        return
      document.getElementById('crypto-body').innerHTML = ''
      makeTable(JSON.parse(data),'crypto-body')
    })
  }
  
  window.timers = {}
  var c = document.getElementById('myCanvas')
  window.ctx = c.getContext('2d')
  var ctxup = document.getElementById('up-chart').getContext('2d')
  var ctxdn = document.getElementById('dn-chart').getContext('2d')
  window.upChartData = {
    labels: ['', '', '', '', '', '', '', '', '', '','', '', '', '', '', '', '', '', '', ''],
    datasets: [{
      backgroundColor: '#ccc',
      borderWidth: 0,
      data: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    }]

  }
  window.dnChartData = {
    labels: ['', '', '', '', '', '', '', '', '', '','', '', '', '', '', '', '', '', '', ''],
    datasets: [{
      backgroundColor: '#ccc',
      borderWidth: 0,
      data: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    }]
  }
  window.upBar = new window.Chart(ctxup, {
    type: 'bar',
    data: window.upChartData,
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
            callback: function() {
              return ''
            }
          },
          gridLines : {
            drawBorder: false,
            display : false
          }
        }],
        xAxes: [{
          ticks: {
            callback: function() {
              return ''
            }
          },
          gridLines : {
            drawBorder: false,
            display : false
          }
        }]
      }
    }
  })
  window.dnBar = new window.Chart(ctxdn, {
    type: 'bar',
    data: window.dnChartData,
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
            callback: function() {
              return ''
            }
          },
          gridLines : {
            drawBorder: false,
            display : false
          }
        }],
        xAxes: [{
          ticks: {
            callback: function() {
              return ''
            }
          },
          gridLines : {
            drawBorder: false,
            display : false
          }
        }]
      }
    }
  })
  var socket = window.io()
  socket.on('playing', function(data){
    document.getElementById('now-playing').innerHTML =  data.artist+ ' - ' + data.name
  })
  socket.on('paused', function(){
    document.getElementById('now-playing').innerHTML =  ''
  })
  window.refreshrate = 2000
  getCPU()
  getCPUTemp()
  getMem()
  getNet()
  getProcesses()
  getCrypto()
})