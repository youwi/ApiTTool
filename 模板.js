


module.exports={

  // "注释":"json不支持写注释,但是可以这样写 IP 暂时没用上,数据库暂时也没有用上,数据库的写法有规定",
  "db":{
    "table_name":   [   {     }   ]//这是高级属性
  },
  "sql":"insert into table_comment values(....数据库暂时不支持........)",
  "ip":"192.168.1.12:8080", //特殊情况下必须用这个IP,不区分环境用这个IP,
  "port":80,
  "url":"http://192.168.1.12:8080",
  "POST":{
 //   "注释":"和post方式提交的内容",如果本身是 json字符串的话
  },
  "JSON":{
    //如果上传的东西 本身是json字符串,请用这个参数,不用post,因为post是 键值对.
  },
  "GET":{
 //   "注释":"和get方式提交的内容" 取消,不现使用
  },
  "arg":{
  //  "注释":"这里的参数是用POST方式提交"取消,不现使用
  },
  "exp": {

  },
  "mock":{
  //  "注释":"mock的参数或url"
  }
}

// 还可以在这个脚本中写新的代码来操作操作数据库这类的
function my_action(){
    // 单独做自己的操作,操作在请求之前,
    // 注意是异步操作

}


require("./run.js");//直接把运行程序加入进来,反向运行本脚本
// 不用担心重复运行
