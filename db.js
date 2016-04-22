/*

    数据库处理

    初化化或执行数据库脚本,等
 */

var mysql=require("mysql");
var properties=require("./env.js");
var pool = mysql.createPool(properties.db);//数据库配置

var query=function(sql,callback){
    if(sql=="close"){
        pool.end();
        return;
    }
    if(pool._closed ){
        pool = mysql.createPool(properties.db);//数据库配置
        setTimeout(function(){
            pool.end();
        },15*1000);// 最长等10s
    }

    pool.getConnection(function(err,conn){
        if(err){
            if(callback !=null)
                callback(err,null,null);
        }else{
           // conn.querySync(sql);
            var tasks=sql.split(";");
            var cnt=0;

            tasks.forEach(function(item){
                conn.query(item,function(qerr,vals,fields){
                    //释放连接
                    if(qerr)
                        console.log("有错误"+qerr);
                    //事件驱动回调
                    if(++cnt==tasks.length){
                        conn.release();
                        if(callback !=null)
                            callback(qerr,vals,fields);
                    }
                });
            })

        }
    });
};

/*
    这是同步sql的方法
 */
/*var Fiber = require('fibers');
query.sync=function(sql){

    var out=null;
    Fiber(function(){
        var fiber=Fiber.current;
        query(sql,function(err,vals){
            out=vals;
            fiber.run(vals);
          //  console.log( vals);
        });
        out=Fiber.yield();
    }).run();
    //
  //  }).run();
   // while(out==null);//会卡到死,线程没有空闲


   // return out;

};*/
setTimeout(function(){
    pool.end();
    console.log("15s关闭数据库连接")
},15*1000);// 最长等10s
query.close=function(){
    pool.end();
    console.log("手动结束数据库连接,强制退出进程");
   // process.exit();
};
module.exports=query;




 //console.log(    query.sync("select * from t_user") );
//这是一个类
/*
function Dbutils(fn){
    eval(fn);
    init();
}

Dbutils.prototype.init=function(config){

    var mysql      = require('mysql');
    this.pool = mysql.createPool({
        host     : '192.168.1.12',
        user     : 'root',
        password : 'focoon',
        database : 'test',
        port: 3306
    });
};
Dbutils.prototype.close=function(){
    this.pool.end();
};
Dbutils.prototype.exec=function(sql,callback){
    this.pool.getConnection(function(err,conn){
        if(err){
           if(callback !=null) callback(err,null,null);
        }else{
            conn.query(sql,function(qerr,vals,fields){
                if(qerr)
                    console.log("有错误"+qerr);
                //释放连接
                conn.release();
                //事件驱动回调
                if(callback !=null)
                    callback(qerr,vals,fields);
            });
        }
    });

};
module.exports=Dbutils;
*/