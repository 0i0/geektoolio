var child_process = require('child_process');
var readline      = require('readline');
var os            = require('os');
var exec0         = child_process.exec;
const si          = require('systeminformation');
var smc           = require('smc');
var request       = require('request');

var express = require('express')

var app = express()

app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'pug')

app.get('/',function(req,res){
  res.render('index');
})
app.get('/test',function(req,res){
  res.render('test');
})
app.get('/pcpu', function (req, res) {
  var cpus_start = os.cpus();
  setTimeout(function(){
    var cpus_end = os.cpus();
    pcpu = [];
    for(var i = 0, len = cpus_end.length; i < len; i++) {
        var cpu_start = cpus_start[i],
            cpu_end =   cpus_end[i],
            total = 0;

        for(var type in cpu_start.times) {
            total += cpu_end.times[type]-cpu_start.times[type];
        }
        cpu_user = cpu_end.times.user-cpu_start.times.user
        cpu_sys  = cpu_end.times.sys-cpu_start.times.sys
        pcpu[i] = Math.round(100 * (cpu_user+cpu_sys)/ total)
        
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(pcpu))
  },1500)

})
app.get('/cputemp', function (req, res) {
    res.send(smc.get('TC0P').toString())
})
app.get('/mem', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({total:os.totalmem()
                          ,free:os.freemem()
                          }))
})
app.get('/net', function (req, res) {
  si.networkInterfaceDefault(function(interface){
    si.networkStats(interface, function(data) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({rx:Math.round(data.rx_sec/8/1024*100)/100
                          ,tx:Math.round(data.tx_sec/8/1024*100)/100
                          }))
    })
  })
})
app.get('/ps', function (req, res) {
  function cb(error, stdout, stderr) {
    str = stdout.replace(/:/g,'],[')
    str = str.replace(/</g,'"')
    str = '[['+str+']]'
    res.setHeader('Content-Type', 'application/json');
    res.send(str)
  };
  exec0("ps -Ao pid,%cpu,%mem,comm |sort -nrk 2 | head -n 5 | awk '{gsub(\"(.+/)\",\"\",$4);print \"<\"substr($4,1,13)\"<\"\",\"$1\",\"$2\",\"$3\":\"}'",cb);
})
app.get('/crypto', function (req, res) {
  request.get('https://api.coinmarketcap.com/v1/ticker/',{},function(err,gres,body){
    if(err) return
    if(res.statusCode !== 200 ) return
    
    qoutes=JSON.parse(body)
    qoutes.splice(5,qoutes.length-5)
    for (var i = 0; i < 5; i++) {
      qoutes[i] = [qoutes[i].id,qoutes[i].price_usd]
    }
    res.send(qoutes)
  });
})

console.log('running on http://localhost:3000')
app.listen(3000);