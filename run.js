
/*
    By yuzhencheng

    请进入当前目录执行程序
 */


//得到P0对象
if( global.allcase==undefined ){
    process.on("exit", function(err) {
        formatJunit();
    })
    global.allcase=new Object();
}



function dojob(onlyfile) { //如果有参数文件的话



    //console.log("-------当前目录"+process.cwd());

   // console.log("参数化显示主页");
   // require("./arg_rst");
    var path = require("path");
    var fs = require("fs");
    var callback=function(){};//空方法,收尾方法
    // var files = fs.readdirSync(path.resolve("", ""));
    //在当前目录下的所有json文件
    //__dirname
    if(typeof onlyfile == 'function'){
          callback=onlyfile;
        var files=scanFolder(__dirname).files;
    }else  if( typeof onlyfile =='object' ){
      //  console.log(onlyfile);
       // doss(onlyfile);
       // return;
        files=[global.loopcount+"-"+module.parent.filename];
    }else if( onlyfile !=null)  //如果是一个文件名,就运行一个案例!
        files=[onlyfile];
    if(onlyfile==null)  //如果为空运行所有案例!
        var files=scanFolder(__dirname).files;



    files.forEach(function (file) {
        global.allcase[file]=new Object();
        var http = require("http");
        if( typeof onlyfile =='object' ) {
          //  console.log(onlyfile);
            doss(global.PO);
        }
        file=file.replace("./","");
        file=file.replace(__dirname+"/","");
        file=file.replace(__dirname,"");
        var jsonFile = file;
        if (jsonFile.indexOf(".js") == -1 ) return;
        if(
               jsonFile=="run.js"
            || jsonFile=="env.js"
            || jsonFile=="test.js"
            || jsonFile=="db.js"
            || jsonFile=="bundle.js"
            || jsonFile=="server.js"
            || jsonFile=="模板.js"
            || jsonFile=="模板.json"
            || jsonFile.endsWith("dataDriver.js")
        ) return;//名单,不是案例
        console.log("+++++"+file);

        //var PO = require(path.resolve("", "", jsonFile));

        if(typeof onlyfile =='Object') console.log("sd");

       // delete require.cache[ __dirname+"/"+file];
        var PO;

        if(jsonFile.indexOf("/") ==0)
              PO=require(jsonFile);
        else
              PO=require( "./"+jsonFile);
        if(PO.run==false|| PO.url==null){

            global.allcase[file].msg="ignore";
            if(module.parent==null){
                console.log(" < 忽略:"+file)
                return;// run如果是false的话
            } //runjs开始运行{
            else
            ;
        }


        //http.setTimeout(2000);
        if(PO.sql){
            var dbt=require("./db");
            dbt(PO.sql,function(){doss()});
        }else{
            doss(PO);
        }
        function doss(PP) {

            if(PP) PO=PP;
            var body = '';

            var property = require("./env.js");
            //ip2.serverip;
            //var rurl=PO.url.replace(/\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}:\d+/,property.serverip);

            var url_formater = require("url");
            //if(!PO.url) return;
            var qry_content = url_formater.parse(PO.url);
            qry_content.host = PO.ip || property.serverip || "127.0.0.1:8080";
            qry_content.port = qry_content.host.split(':')[1] || 8080;
            qry_content.host = qry_content.host.split(':')[0];
            qry_content.port = PO.port || property.serverport || qry_content.port;
            //  url 中的ip会被环境配置,如果
            qry_content.path;

            var opt;

            var data;//=PO.arg;
            if (PO.JSON != null) {
                opt = {
                    host: qry_content.host,
                    port: qry_content.port,
                    method: 'POST',
                    path: qry_content.path,
                    headers: {'Content-Type': 'application/json; charset=UTF-8'}

                };
                data = JSON.stringify(PO.JSON);
                //  data=PO.JSON;
            } else if (PO.POST != null) {
                opt = {
                    host: qry_content.host,
                    port: qry_content.port,
                    method: 'POST',
                    path: qry_content.path,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
                };
                data = require('querystring').stringify(PO.POST);
            } else {
                if (qry_content.path.indexOf("?") != -1)
                    qry_content.path += "&" + require('querystring').stringify(PO.GET || PO.arg);
                else
                    qry_content.path += "?" + require('querystring').stringify(PO.GET || PO.arg);
                opt = {
                    host: qry_content.host,
                    port: qry_content.port,
                    method: 'GET',
                    path: qry_content.path,//+"&"+require('querystring').stringify(PO.GET||PO.arg)
                    headers:{
                        "Cookie":global.cookie  //如果有Cookie的话
                    }
                };
                // data=//encodeURIComponent 已经自动触
                data = "";
                //data=PO.GET;
            }
            //opt.pathname=opt.path;
            //opt.protocol="http:";
            //opt.port=
            //  opt.
            var realurl = url_formater.format({
                pathname: opt.path,
                protocol: "http:",
                host: opt.host + ":" + opt.port,
                hostname: opt.host,
                port: opt.port
            });
            realurl = realurl.replace("%3F", "?");
            global.allcase[file].dodo = opt.path.match(/\w+$/);
            var req = http.request(opt, function (res) {
                var tlsmsg = "";

                res.on('data', function (d) {
                    body += d;
                }).on('end',function (e) {
                    global.allcase[file].etime=new Date();//结束时间
                    try{
                        if(this.headers["content-type"].indexOf("image") >-1 )
                            body="{\"msg\":\"图片\"}";
                    }catch(err){console.log(err)}
                    tlsmsg += this.statusCode + " " + this.statusMessage + "\n";
                    tlsmsg += this.statusCodealurl + "\n";
                    tlsmsg += " 发送报文:" + data + "\n";
                    tlsmsg += " 期待报文:" + JSON.stringify(PO.exp) + "\n";
                    tlsmsg += " 返回报文:" + body + "\n";
                    // tlsmsg+=body+"\n"
                    if (this.statusCode == 404)   console.log("404");
                    if (global.loghttp)  console.log(file + " " + realurl);
                    if (global.logout)   console.log(" 发送报文:" + data);
                    if (global.logout)   console.log(" 期待报文:" + JSON.stringify(PO.exp));
                    if (global.logout)   console.log(" 返回报文:" + body);
                    //console.log(">>"+url+" "+res.statusCode+"  " +body+"--------end--------");
                    try {
                        if(this.statusCode!=404)
                            var out = JSON.parse(body);
                        else{
                            var out={"err":404};
                            body="{\"err\":\"错误页面:404\"}";
                        }


                    } catch (err) {
                        //  console.log(" json转换错误" + err + body);
                        var fs = require('fs'),
                            xml2js = require('xml2js');

                        var parser = new xml2js.Parser();
                        parser.parseString(body, function (err, result) {
                            console.log(err,result);
                            out=result;
                        });

                        if(out==null)
                            out = {
                                "error": "error," + "json转换错误," + html_encode(err),
                                msg: "有错误"
                            }
                        if (body == "")
                            out = {};
                        if (body.split(" ")[0] == "")
                            out = {};
                    }

                    //global.allcase[file].out=body;
                    if (JSON.stringify(out) === (JSON.stringify(PO.exp))) {
                        console.log(" 结果:完全相等");
                        global.allcase[file].msg = "pass";
                        // return;
                    } else {
                        global.allcase[file].msg = eachitem(PO.exp, out);
                        if (global.allcase[file].msg == undefined)
                            global.allcase[file].msg = "pass";
                        else
                            console.log(" 结果:" + global.allcase[file].msg);
                        // 转义
                        global.allcase[file].msg = html_encode(global.allcase[file].msg);
                    }


                    global.allcase[file].out = html_encode(tlsmsg);//文本


                    for (st in global.allcase) {
                        if (global.allcase[st].msg == undefined) return;

                    }
                    //global.allcase[file].msg=tlsmsg+global.allcase[file].msg;
                    req.abort();// 整个请求!
                    PO.out=out;
                    if(PO.next){
                        doss(PO.next);
                    }

                //    formatJunit();//最后一个人来完成这个任务
                    callback();

                });

            }).on('error', errfun=function (e) {
                if(e==undefined) e=new Object();
                if(global.allcase[file] ==undefined) global.allcase[file]=new Object();
                global.allcase[file].etime=new Date();//结束时间
                req.abort();// 整个请求!
                if (global.loghttp)  console.log(realurl);
                if (global.logout)   console.log(" 发送报文:" + data);
                if (global.logout)   console.log(" 返回报文:" + body);
                console.log(" 结果: error: " + e.message);

                //var  out={"error":"error,json转换错误,"+html_encode(e.message),msg:"有错误"};
                global.allcase[file].msg = "error:" + e.message;
                for (st in global.allcase) {
                    if (global.allcase[st].msg == undefined) return;

                }
                if(PO.next){
                    doss(PO.next);
                }

              //  formatJunit();//最后一个人来完成这个任务
                req.abort();// 整个请求!
                callback();

            }).on("abort",function () {
             //    formatJunit();//最后一个人来完成这个任务
                 req.abort();// 整个请求!
                 callback();
            });

            //var qry_formater=require("querystring");
            //if(PO.JSON!=null){
            //    req.write(data);
            //}else if(PO.POST!=null){
            //    req.write(data);
            //}else{
            //    req.write(data);
            //}
            global.allcase[file].ptime=new Date();//预备时间
            req.write(data);
            // 控制在外部....无误
            /*
             var rrt= setInterval(function () {
             console.log("req.abort();")
             if(global.allcase[file].msg != undefined ){
             clearInterval(rrt);
             req.abort();// 整个请求!
             }

             }, 1 * 1000); //从外部做延时*/


            setTimeout(function () {
                //  console.log("req.abort();")
                req.abort();// 整个请求!
            },2*1000);
            //res.destroy();
            req.end();
            global.allcase[file].stime=new Date();//开始时间

            //性能监控--暂时不做.
            var os=require("os");
            global.allcase[file].sysinfo = {
                'busy':os.loadavg(),
                'hostname'   : os.hostname(),
                'systemtype' : os.type(),
                'release'    : os.release(),
                'uptime'     : os.uptime(),
                'loadavg'    : os.loadavg(),
                'totalmem'   : os.totalmem(),
                'freemem'    : os.freemem(),
                'cpus'       : os.cpus(),
                'disk'       : ''
            };
        }


    });

}
/*
 对比obj的属性差别
 以obj1为
 */
var depth=0;

function eachitem(objexp,objout,msg){
    depth++;

    // console.log(depth);
    if(objexp==objout ||JSON.stringify(objexp)==JSON.stringify(objout)) {
       // console.log( objexp+"=="+objout)
        return;
    }
    try{
        if(objout.error  ) return objout.error ;
    }catch(err){
        return "f-error 结构变化太大,解析出错误";
    }


    for(a in objexp){

        if( !objexp[a] ){
            //  console.log(a+" missing");
            // null 或值不存在  || !objout[a]
            continue;
        }

        if(objexp[a]==objout[a]  || JSON.stringify(objexp[a])==JSON.stringify(objout[a])){
            // console.log( obj1[a]+"=="+obj2[a]);
        }else{
            var jsonLength1 = 0;
            for(var item in objexp[a]){
                jsonLength1++;
            }

            var jsonLength2 = 0;
            for(var item in objexp[a]){
                jsonLength2++;
            }

            if(jsonLength1<=1  || jsonLength2<=1 ){
                if(objexp[a]==objout[a] ) {
                    //console.log( obj1+"=="+obj2)
                    continue;
                } else{
                //    console.log(a+"  "+objexp[a]+"!="+objout[a]);
                    msg+=a+"  "+objexp[a]+"!="+objout[a]+"\n";
                    continue;
                }
            }
            if(typeof(objexp[a])=='string'){
                if(objexp[a]==objout[a] ) {
                    //console.log( obj1+"=="+obj2)
                    continue;
                } else{
                //    console.log(a+"  "+objexp[a]+"!="+objout[a]);
                    msg+=a+"  "+objexp[a]+"!="+objout[a]+"\n";
                    continue;
                }
            }  //字符就不再进入了
            return     eachitem(objexp[a],objout[a],msg);
        }

    }
    return msg;

}
/*
 format
 */

function formatJunit(){

    var casename;//名字
    var casestate;//状态
    var caseinfo;//消息

    var passcount=0;
    var disablecount=0;
    var failcount=0;
    var totalcount=0;

    for(var s in global.allcase){
        if(global.allcase[s].msg=="pass")
            passcount++;
        else if(global.allcase[s].msg=='ignore')
            disablecount++;
        else
            failcount++;
        totalcount++;
    }

    var path=require("path");
    var page=path.relative("..", "."); //文件夹的名字
    var jfile=path.relative("..", ".")+"_report.xml";
    var content='<?xml version="1.0" encoding="UTF-8"?>\n\
    <testsuites disabled="" errors="" failures="" name="" tests="" time="">\n\
        <testsuite disabled="0" errors="0" failures="'+failcount+'" hostname="" id=""  name="" package="" skipped="0" tests="'+totalcount+'" time="0" timestamp="0">\n';

    var content='<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<testsuites>\n';

    //var page="root";

    var ken=new Object();// 占坑用的
    var preken;//上一个坑
    var cnt=0;

    var suitelist=new Object();
    for(a in global.allcase){
        var suite= a.split("/");//一级目录名
        // || )  //如果还有坑,要生成坑了
        if( suite.length>1  ){
            global.allcase[a].suite=suite[0];
            suitelist[suite[0]]=suite[0];
        }else  {
            global.allcase[a].suite='root';
            suitelist['root']='root';
        }
    }


    for( s in suitelist) {
        cnt++;

        content+="\t<testsuite name=\""+s+"\">\n";
        for (a in global.allcase) {
           // if(!global.allcase[a].delete) continue;
            if(global.allcase[a].suite===s ) {
                var alctime=(global.allcase[a].etime-global.allcase[a].stime)/1000;
                var cpuuse=global.allcase[a].sysinfo?global.allcase[a].sysinfo.busy[0]:"NaN";
               // global.allcase[a].delete=true;
                if (global.allcase[a].msg == 'pass'){
                    content += '\t\t<testcase  classname="' + page + '" name="' + a + '" status="pass" time="'+alctime+'">\n\
                    <system-out>CPU' +cpuuse+"% ,"+ global.allcase[a].out + '</system-out>\n\t\t</testcase>\n';
                }else if(global.allcase[a].msg == 'ignore'){
                    content += '\t\t<testcase   classname="' + page + '" name="' + a + '" status="pass" time="'+alctime+'">\n\
                    <system-out>CPU' +cpuuse+"% ,"+ global.allcase[a].out + '</system-out>\n\t\t</testcase>\n';
                }else{
                    content += '\t\t<testcase   classname="' + page + '" name="' + a + '" status="fail" time="'+alctime+'">\n\
                    <failure message="'+ global.allcase[a].msg + '" type=""/>\n\
                    <system-out>CPU' +cpuuse+"% ," + global.allcase[a].out  + '</system-out>\n\t\t</testcase>\n';

                }
                content+="<sysinfo>"+JSON.stringify(global.allcase[a].sysinfo)+"</sysinfo>\n"
            }else{

            }

        }
        content += '\t</testsuite>\n\n';

    }
    content += '</testsuites>';
    fs = require("fs");
    fs.writeFileSync(jfile, content);
    console.log("-------总数:"+totalcount,
     "通过:"+passcount,
     "失败:"+failcount,
    "忽略:"+disablecount);
    require("./db.js").close();
}

/*
 获取属性数量
 */
function getJsonLength(jsonData){
    var jsonLength = 0;
    for(var item in jsonData){
        jsonLength++;
    }
    return jsonLength;
}
    function xml_replace(str){

        str=str.replace(">","\\>");
        str=str.replace("<","\\<");
        return str;
    }
function html_encode(str)
{
    var s ="";
    str=str.toString();
    if(str.length == 0)return "";
    s = str.replace(/&/g,"&amp;");
    s = s.replace(/</g,"&lt;");
    s = s.replace(/>/g,"&gt;");
   // s = s.replace(/ /g,"&nbsp;");
    s = s.replace(/\'/g,"&#39;");
    s = s.replace(/\"/g, "&quot;");
   // s = s.replace(/\n/g, "<br>");
    return s;
}
/*
 test
 */

function t(){

 //   var j1=require("./arg_rst/case_f1.json");
  //  var j2=require("./arg_rst/case_f2.json");

  //  eachitem(j1,j2);

}



function scanFolder(path){
   var fs=require("fs");
    var fileList = [],
        folderList = [],
         walk = function(path, fileList, folderList){
           var files = fs.readdirSync(path);
            files.forEach(function(item) {
                if(item==".svn" || item==".git") return;// 不要svn和git目录
                var tmpPath = path + '/' + item,
                    stats = fs.statSync(tmpPath);

                if (stats.isDirectory()) {

                    walk(tmpPath, fileList, folderList);
                    folderList.push(tmpPath);
                } else {
                    fileList.push(tmpPath);
                }
            });
        };

    walk(path, fileList, folderList);

     var p= require("path");

    console.log('-------获取文件列表,扫描成功:' +  p.relative("/",".")+'');

    return {
        'files': fileList,
        'folders': folderList
    }
}



function initdb(callback){
    var fs=require("fs");
    var dbt=require("./db.js");


            //var fiber = Fiber.current;//一个断点
            var files = fs.readdirSync(__dirname+"/__DB__");
           // var fiber_total = Fiber.current;//一个断点
            var tasks=new Array();
            files.forEach(function (file) {
                if (file.indexOf(".sql") != -1 && file.indexOf(".sql.") == -1) {
                    // global.allcase[file]=new Object();
                    var lines = fs.readFileSync("__DB__/" + file);
                    tasks=tasks.concat(lines.toString().replace(/\n/g,"").split(";"));
                }
            });
            for(var i = 0 ;i<tasks.length;i++)            {
                if(tasks[i] == "" || typeof(tasks[i]) == "undefined")
                {
                    tasks.splice(i,1);
                    i= i-1;
                }
            }
            var cnt=0;
            tasks.forEach(function(item){

                    console.log("sbc",item)
                    //item[0].trim();
                    if(item !=null)
                        item = item.trim();
                    dbt(item, function (err, res) {
                        console.log(res);
                       // if (tasks[tasks.length - 1]== item)
                        if(++cnt==tasks.length){
                            console.log("数据库操作完成")
                            console.log("最后的结束");
                          //  dbt.close();
                            callback?callback():function(){}
                        }

                    });
                });



       // callback();

}

//formatJunit();
module.exports.dojob=dojob;
//dojob("/Users/yu/workspace/features/api/列表list.do/跳转测试.js")
//t();
//console.log("最大深度"+depth);
var runmod=module;

if( module.parent==null){
   initdb(dojob);//初始化数据库,然后全部运行
}else if( module.parent.parent==null){//必须为1级包含
    process.chdir(__dirname);// 进入当前目录
    if( module.parent.filename.endsWith("dataDriver.js"))
        dojob(module.parent);//运行上级的
    dojob(module.parent.filename);//运行上级的
}else{
    //多级包含不运行!
    //多级包含时查找可以运行的
    console.log("超过2级调用不运行");
    if(module.parent.exports.run==null|| module.parent.exports.run==true)
        dojob(module.parent.filename);//运行上级的

     //   return;

/*    while(runmod.parent){
        runmod=runmod.parent
        console.log("..转换上级..")
    }
    if( runmod.exports.run!=false)
        dojob(runmod.filename)*/
}
/**/



/*

if( module.parent==null){
    initdb(dojob);//初始化数据库
    //   ();
}
else if(module.parent.exports.url!=null) {  //有url说明是案例
    //得想个办法防止错误加载
    //process.cwd();
    process.chdir(__dirname);// 进入当前目录
    console.log( process.cwd()+"--------上级:"+module.parent.filename);
    if(module.parent.parent==null) //非多级引用
        dojob( module.parent.filename);//如果多级引用就麻烦了!
    else{
        while(module.parent)
            module=module.parent
        dojob( module.filename);//如果多级引用就麻烦了!

    }
    console.log("--------上级:"+module.parent.filename);
}else{
    //for( ss in module.parent){
    //    console.log(ss);
    //}
}*/
