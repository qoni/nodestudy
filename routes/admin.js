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


  //查询文章数量
  Article.count({},function (err,ret) {
    if(err) return next(err);
    //格式化页码
    var page=Number(req.query.page);
    if(!(page>0)) page=1;

    var limit=4;

    if(!(page<Math.ceil(ret/limit))) page=Math.ceil(ret/limit);
    //当前分页
    res.locals.page=page;
    //数据库存数量
    res.locals.count=ret;
    res.locals.limit=limit;

    //查询文章列表
    Article.find({})
        .skip((page-1)*limit)
        .limit(limit)
        .sort({date: -1})
        .exec(
            function (err,ret) {
              if (err) return next(err);
              res.locals.list=ret;
              res.render("admin/article/list");
            }
        )
  });
});

//删除文章内容页
router.post('/admin/article', function(req, res, next) {
  var id=req.body.mid;
  Article.findOne({_id:id},function (err,ret) {
    if (err) return res.json({error:err.toString()});
    Article.remove({ _id:id}, function (err) {
      if (err) return next(err);
      res.json({success:ret});
    });
  });
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

//编辑文章内容页
router.get('/admin/article/edit/:id', function(req, res, next) {
  Article.findOne({_id:req.params.id},function (err,ret) {
    if (err) return next(err);
    res.locals.article=ret;
    res.render("admin/article/edit");
  })
});

//更新文章内容
router.post('/admin/article/edit/:id', function(req, res, next) {
  var id=req.params.id;
  var title=req.body.title;
  var body=req.body.body;
  //参数检查
  if(!id) return res.json({error:'文章ID不正确'});
  if(!title) return res.json({error:"请填写标题"});
  if(!body) return res.json({error:"请填写内容"});

  //检查文章是否存在
  Article.findOne({_id:id},function (err,ret) {
    if (err) return res.json({error:err.toString()});
  //是否有查询到结果
    if(!ret) return res.json({error:"文章ID不正确"});

    //检查标题是否重复
    Article.findOne({title:title},function (err,ret) {
      if (err) return res.json({error:err.toString()});
      //是否有查询到结果
      if(ret && ret._id.toString()!==id) return res.json({error:"数据库中已存在相同标题的文章"});

      //更新数据到数据库
      Article.update({
        _id:id
      },{
        title:title,
        body:body,
        date:new Date()
      },function (err,ret) {
        if(err) return res.json({error:err.toString()});
        res.json({success:ret});
      });
    });
  });
});



module.exports = router;
