/**
 * 初始化MongoDB连接
 */
var mongoose=require("mongoose");
var config=require("../config");

//创建MongoDB连接
var conn=mongoose.createConnection(config.mongodb);

//监听出错信息
conn.on("error",function (err) {
    console.error(err);
    //结束进程
    process.exit();
});

//输出MongoDB连接
module.exports=conn;