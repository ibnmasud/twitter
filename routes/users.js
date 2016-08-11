var express = require('express');
var router = express.Router();
var md5 = require('md5');
var uuid = require('node-uuid');
var db = require('../db/mongo')


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* Follow. */
router.post('/follow/', function(req, res, next) {
  var user = req.body.user
  var id = req.headers.id
  if (user!=='' && user!==id){
    db.get().collection("users").find({username:user}).limit(1).toArray().then(function(docs){
      if(docs.length === 1){
        db.get().collection("users").find({username:id}).limit(1).toArray().then(function(userdocs){
          if(userdocs.length === 1){
            if(userdocs[0].follow){
              if (userdocs[0].follow.indexOf(user)===-1)
                userdocs[0].follow.push(user)
            }else{
              userdocs[0].follow=[user]
            }
            db.get().collection("users").replaceOne({username:id},userdocs[0],function(err,results){
              if(err)
                res.json({error:"Error while updating user follows in DB"})
              res.json({follow:userdocs[0].follow})
            })
          }else{
            res.json({error:"Odd... Authenticated user not found in DB."})
          }
        })
      }else{
        res.json({error:"User not found."})
      }
    })
  }else{
    res.json({error:"Missing required informations"})
  }
});

/* Un-Follow. */
router.post('/unfollow/', function(req, res, next) {
  var user = req.body.user
  var id = req.headers.id
  if (user!=='' && user!==id){
    db.get().collection("users").find({username:id}).limit(1).toArray().then(function(userdocs){
      if(userdocs.length === 1){
        if(userdocs[0].follow){
          var pos = userdocs[0].follow.indexOf(user);
          if (pos > -1) {
            userdocs[0].follow.splice(pos, 1);
          }
        }
        db.get().collection("users").replaceOne({username:id},userdocs[0],function(err,results){
          if(err)
            res.json({error:"Error while updating user follows in DB"})
          res.json({follow:userdocs[0].follow})
        })
      }else{
        res.json({error:"Odd... Authenticated user not found in DB."})
      }
    })
  }else{
    res.json({error:"Missing required informations"})
  }
});

/* Login. */
router.post('/login/', function(req, res, next) {
  var username = req.body.username
  var password = md5(req.body.password)
  if (username!=='' && req.body.password!==''){
    db.get().collection("users").find({username:username}).limit(1).toArray().then(function(docs){
      if(docs.length === 1 && docs[0].password === password){
          //res.json({error:"Userid is taken"})
          var token = uuid.v4()
          db.get().collection("tokens").insertOne({id:username,token:token,date:Date.now()},function(err,result){
            if (err)
              res.json({error:"Error while creating token in DB"})
            res.json({token:token})
          })
      }else{
          res.json({error:"Invalid User"})
      }
    })
  }else{
    res.json({error:"Missing required informations"})
  }
});

/* Register. */
router.post('/register/', function(req, res, next) {
  //res.json(req.body);
  var username = req.body.username
  var password = md5(req.body.password)
  if (username!=='' && req.body.password!==''){
    db.get().collection("users").find({username:username}).limit(1).toArray().then(function(docs){
      if(docs.length === 1){
          res.json({error:"Userid is taken"})
      }else{
          db.get().collection("users").insertOne({username:username,password:password},function(err,result){
            if (err)
              res.json({error:"Error while inserting to DB"})
            res.json({id:result.insertedId})
          })
      }
    })
  }else{
    res.json({error:"Missing required informations"})
  }
});

module.exports = router;