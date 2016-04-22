/*
    TODO 抢建一个服务器
    创建一个http服务器可以在线编辑和修改代码
    **想得太多了,哈**

 */
/*
var http=require("http");
var server=http.createServer(function (request, response) {

    console.log(request)
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write('{"test":"test"}');
    response.end();
  //  http.Server().close();

});
server.listen(8899);
*/
var http=require("http");
http.createServer(function (request, response) {
    var body = [];
    console.log(request.method);
    console.log(request.headers);
    request.on('data', function (chunk) {
        body.push(chunk);
    });
    request.on('end', function () {
        body = Buffer.concat(body);
        console.log(body.toString());
        console.log(request.url);
        response.write(body);
        response.end();
    });
}).listen(80);