


require("./env.js");
global.PO=module.exports={

    "url":"http://192.168.31.12:8080/mobile/ios/bbgo/iospay.do",
    "port":8080,
    "arg":{
        "userId": 123,
        "memo": "xxx",
        "actId":"210",
        "key":"123344",
        "payItems": [
            {
                "itemId": "116",
                "count": 2
            }
        ]
    },

    "exp": {
        "message": "Request method 'GET' not supported",
        "status": "5"
    },
    "mock":{

    }
}

require("./run.js");