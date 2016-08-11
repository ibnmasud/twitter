var express = require('express');
var router = express.Router();
var db = require('../db/mongo')

/* GET users listing. */
router.get('/', function(req, res, next) {
  var id = req.headers.id
  var page = 0
  var pagelen =  10
  if(req.body.getAll){
    db.get('tweets').find().skip(page*pagelen).limit(pagelen).sort({time:-1}).toArray().then(function(tweets){
        var data = {tweets:tweets}
        if (tweets.length ===10)
          data.hasnext = true
        res.json(data)
      })
  }else if (req.body.hash){
    db.get('tweets').find({hash:{$in:[req.body.hash]}}).skip(page*pagelen).limit(pagelen).sort({time:-1}).toArray().then(function(tweets){
        var data = {tweets:tweets}
        if (tweets.length ===10)
          data.hasnext = true
        res.json(data)
      })
  }else{
    if (req.body.page)
      page = req.body.page
    db.get('users').find({username:id}).limit(pagelen).toArray().then(function(userdocs){
      if(userdocs[0].follow){
        db.get('tweets').find({owner:{$in:userdocs[0].follow}}).skip(page*pagelen).limit(pagelen).sort({time:-1}).toArray().then(function(tweets){
          var data = {tweets:tweets}
          if (tweets.length ===10)
            data.hasnext = true
          res.json(data)
        })
      }else{
        res.json({tweets:[]})
      }
    })
  }
});

/* POST users listing. */
router.post('/', function(req, res, next) {
  var msg = req.body.msg
  var id = req.headers.id
  var obj = {owner:id,msg:msg,hash:str.match(/#\w+/g),users:str.match(/@\w+/g),time:Date()}
  db.get('tweets').insertOne(obj,function(err,result){
    if (err)
      res.json({error:'Error while creating token in DB'})
    res.json({tweetid:result.insertedId})
  })
});

module.exports = router;
