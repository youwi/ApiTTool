/**
 * Created by yu on 16/4/21.
 */

/*

        |age |  name |  address |  money |
        |10  |  tom  |  china   |  127   |

        {
            age:10,
            name:tom,
            address:china,
         =>   money:127
         }
         转化按照等关系式来操作.


 */
// var filecache = require('filecache')
//
//
// filecache('.', function(err, cache) {
//    if(err) console.log(err)
// });
var fs=require("fs");

/*
    用data数据直接生成一大堆文件
    classfile为类比/模板文件.
    只支持js的模板文件!
 */
function buildAllFile(  datafile,  classfile) {
    var DIR=datafile.split(".")[0];
    if(!fs.existsSync(DIR)) fs.mkdir(DIR);
    var DATA=getDataList(datafile);


    var str= fs.readFileSync(datafile,{encoding : 'utf8'});
    var src= fs.readFileSync(classfile, {encoding : 'utf8'});
    var lines=str.split("\n");
    var head=[];//行头.
    for(var k=0 ;k<  lines.length;k++){
        var line=lines[k];
        var srccp=src;
        var headok=false;
        if(line.trim().startsWith("#")) continue;
        if(line.trim()==="") continue;

        var cols=line.split("|");
        if(datafile.endsWith(".csv"))
            cols=line.split(",");

        for(var i=0;i< cols.length;i++){    //开始替换
            var col=cols[i].trim();
            if(col !=""){
                if(getPropLength(head)<cols.length-2){
                    head[i]=col;  //处理行头!
                    headok=true;
                }else{
                    var r1="/(.*"+head[i]+".*):(.*[^,^\\n])/";  //这个正则写起来真麻烦...
                    var r2="$1:"+"\""+col+"\"";
                    //  replace(/(.*userId.*):(.*),/,"$1:css")
                    srccp=srccp.replace(eval(r1),r2); // 注意 数字会被包装! 如 1 => "1"
                    headok=false;
                }

            }

        }
        srccp=srccp.replace(/\.\//g,"../"); //目录层次加深!
        if(headok==false)
            fs.writeFileSync(DIR+"/"+(k+1)+classfile, srccp,{encoding : 'utf8'});
    }

  
}

/*
    直接生成一个文件就运行一个文件,也需要模板文件
 用data数据直接生成一大堆文件
 classfile为类比/模板文件.
 */
function buildThenRun(  datafile,  classfile) {
    var DIR=datafile.split(".")[0];
    if(!fs.existsSync(DIR)) fs.mkdir(DIR);
    var DATA=getDataList(datafile);


    var str= fs.readFileSync(datafile,{encoding : 'utf8'});
    var src= fs.readFileSync(classfile, {encoding : 'utf8'});
    var lines=str.split("\n");
    var head=[];//行头.
    for(var k=0 ;k<  lines.length;k++){
        var line=lines[k];
        var srccp=src;
        var headok=false;
        if(line.trim().startsWith("#")) continue;
        if(line.trim()==="") continue;

        var cols=line.split("|");
        if(datafile.endsWith(".csv"))
            cols=line.split(",");

        for(var i=0;i< cols.length;i++){    //开始替换
            var col=cols[i].trim();
            if(col !=""){
                if(getPropLength(head)<cols.length-2){
                    head[i]=col;  //处理行头!
                    headok=true;
                }else{
                    var r1="/(.*"+head[i]+".*):(.*[^,^\\n])/";  //这个正则写起来真麻烦...
                    var r2="$1:"+"\""+col+"\"";
                    //  replace(/(.*userId.*):(.*),/,"$1:css")
                    srccp=srccp.replace(eval(r1),r2); // 注意 数字会被包装! 如 1 => "1"
                    headok=false;
                }

            }

        }
        if(headok==false){
            delete require.cache[ __dirname+'/run.js'];
            global.loopcount=k;
            eval(srccp);

        }

    }


}

function getNextData(){



}

function getDataList(datafile) {



}

/*
    格式化源文件
 */
function formart(datafile){

}

function getPropLength(obj){
    "use strict";
    var i=0;
    for(var ss in obj){
        i++;
    }
    return i;
}

ttest();
function ttest() {
   //  buildAllFile("testdata.txt","testdata.js");
    buildThenRun("testdata.csv","testdata.js");
}