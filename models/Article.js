/**
 * 文章内容 Model
 */
const mongoose = require('mongoose');
var conn=require('../init/mongodb');

//定义模型
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Article = new Schema({
    author    : ObjectId,
    title     : String,
    body      : String,
    date      : Date
});

//访问模型
conn.db.model('Article',Article);
module.exports=conn.db.model('Article');