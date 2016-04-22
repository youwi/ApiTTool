
require('crypto').createHash('md5').update("12345678").digest('hex');

/*
var express = require('express');
var app = express();

app.get('/', function (req, res) {
    console.log(req);
    res.send('Hello World!');
});

app.post('/', function (req, res) {
    console.log(req);
    res.send('Hello World!');
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});

*/




// exports.init= function(){}
// module.exports={a:""};
//
// module.exports={a:"1111"};
//
// eval("module.exports={a:'12121231231"+ Math.random()+"'}");
//
// var tt=require("./test");
//console.log(tt);
//setInterval(function(){console.log(2);},1000);
/*

var Wind = require("wind");
var Task =  Wind.Async.Task;

var A = eval(Wind.compile("async", function () {
    console.log("Start A");
    $await(Wind.Async.sleep(3000));
    console.log("Finish A");
}));

var B = eval(Wind.compile("async", function () {
    console.log("Start B");
    $await(Wind.Async.sleep(5000));
    console.log("Finish B");
}));

var C = eval(Wind.compile("async", function () {
    console.log("Start C");
    console.log("Finish C");
}));

var task = eval(Wind.compile("async", function () {
    $await(A());
    $await(B());
    $await(C());
}));
task().start();

*/

/*


var arp = require('node-arp');
var co = require('co');


function getMAC(ipAddress){
    return function(callback){
        arp.getMAC(ipAddress,callback);
    }
}

co(function*(){
    var address=[
        '192.168.1.100',
        '192.168.1.101'
    ];
    var p1=yield getMAC(address[0]);
    var p2=yield getMAC(address[1]);

    console.log(address[0]+' ->'+p1);
    console.log(address[1]+' ->'+p2);
    return 'done';
    })(function(err,result){
    console.log('err: '+err+', result: '+result);
});*/
