var child_process = require('child_process');
var readline      = require('readline');
var os            = require('os');
var exec0          = child_process.exec;
var exec1          = child_process.exec;

var express = require('express')

var app = express()

app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'pug')

app.get('/',function(req,res){
	res.render('index');
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
  function cb(error, stdout, stderr) {
    res.send(stdout)
  };
  exec1("iStats | grep \"CPU temp\" | awk '{print $3}' | awk -F. '{print $1}'",cb);
})
app.get('/mem', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({total:os.totalmem()
                          ,free:os.freemem()
                          }))
})
app.get('/netdown', function (req, res) {
  function cb(error, stdout, stderr) {
    res.send(stdout.toString())
  };
  exec0(`myvar1=$(netstat -bI en1 | tail -n 1 | awk '{print $7}')
        sleep 1
        myvar2=$(netstat -bI en1 | tail -n 1 | awk '{print $7}')
        subdown=$((($myvar2 - $myvar1)/1024))
        echo "$subdown"`
  ,cb);
})
app.get('/netup', function (req, res) {
  function cb(error, stdout, stderr) {
    res.send(stdout)
  };
  exec1(`myvar1=$(netstat -bI en1 | tail -n 1 | awk '{print $10}')
        sleep 1
        myvar2=$(netstat -bI en1 | tail -n 1 | awk '{print $10}')
        subdown=$((($myvar2 - $myvar1)/1024))
        echo "$subdown"`
  ,cb);
})
console.log('running on http://localhost:3000')
app.listen(3000);