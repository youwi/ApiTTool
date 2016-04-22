
/*
       针对不同的测试环境做不同的关联

 */
//这个文件比较特殊
//这个文件按环境形成一个循环
//所有测试按这个循环来完成测试
// 用环境变量来确认使用哪个配置

global.userkey="67dec5e49694a0414c88d949f5666888";//'8d5482d8fecf028f6f36a91c43f6c056';//a6c780aeb8b2fa05e093e6f9c1fdb75c
global.userid='1654';
global.userpwd='123456';
global.usermobile='18121135456';

global.loghttp=true;
global.logout=true;//打出所有输出;

global.cookie=null;// 全局登陆用的cookie,如果需要的话先登陆.



var env=process.env.TEST_ENV;
if( null== env ){   //默认是本地环境
    module.exports={
        //serverip:"127.0.0.1:4723"   ,//被替换的IP,数组
        serverip:"192.168.1.12:8080"   ,//被替换的IP,数组
        //serverport:8080,
        //IP统一替换
        //不
        db:{
            host     : '192.168.1.12',
            user     : 'root',
            password : 'focoon',
            database : 'thumbible',
            port: 3306
        }
    }
}else if( env=='dev12' ){ // 开发集成环境

    module.exports={
        serverip:"192.168.1.12:8080"   ,//被替换的IP,数组
        serverport:8080,
        db:{
            host     : '192.168.1.12',
            user     : 'root',
            password : 'focoon',
            database : 'thumbible',
            port: 3306
        }
    }
}else if(env=="dev211"){ // 云测试环境
    module.exports={
        serverip:"192.168.1.12"   ,//被替换的IP,数组
        serverport:8080,
        db:{
            host     : '192.168.1.12',
            user     : 'root',
            password : 'focoon',
            database : 'thumbible',
            port: 3306
        }
    }

}else if(env=='pre'){ //预生产环境
    module.exports={
        serverip:"192.168.1.12:8080"   ,//被替换的IP,数组
        serverport:8080,
        db:{
            host     : '192.168.1.12',
            user     : 'root',
            password : 'focoon',
            database : 'thumbible',
            port: 3306
        }
    }
}


