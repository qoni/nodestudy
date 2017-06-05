var express = require('express');
var router = express.Router();
var Article=require("../models/Article");

/* 后台首页. */
router.get('/admin', function(req, res, next) {
  //渲染页面
  res.render('admin/index');
});

//文章列表
router.get('/admin/article', function(req, res, next) {
  Article.find({},function (err,ret) {
    if (err) return next(err);
    res.locals.list=ret;
    res.render("admin/article/list");
  })
});

//查看文章内容页
router.get('/admin/article/view/:id', function(req, res, next) {
  Article.findOne({_id:req.params.id},function (err,ret) {
    if (err) return next(err);
    res.locals.article=ret;
    res.render("admin/article/view");
  })
});

/* 录入文章页. */
router.get('/admin/article/new', function(req, res, next) {
  //渲染页面
  res.render('admin/article/edit');
});

//保存新文章
router.post('/admin/article/new', function(req, res, next) {
  var title=req.body.title;
  var body=req.body.body;
  //参数检查
  if(!title) return res.json({error:"请填写标题"});
  if(!body) return res.json({error:"请填写内容"});

  //检查标题是否重复
  Article.findOne({title:title},function (err,ret) {
    if (err) return res.json({error:err.toString()});
    //是否有查询到结果
    if(ret) return res.json({error:"数据库中已存在相同标题的文章"});

    //保存到数据库
    var a=new Article({
      title:title,
      body:body,
      date:new Date()
    });
    a.save(function (err,ret) {
      if(err) return res.json({error:err.toString()});
      res.json({success:ret});
    });
  });
});

module.exports = router;
