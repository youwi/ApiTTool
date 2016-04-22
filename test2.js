/**
 * Created by yu on 16/4/21.
 */


var ss=require("./test");
console.log(ss);


var path = require('path');
var pwd = path.resolve();
    pwd += '/test.js';

delete require.cache[pwd];

  

ss=require("./test");
console.log(ss);
