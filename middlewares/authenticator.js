var db = require('../db/mongo')
var assert = require('assert');
var config = require('../config/config.json');
var ignoreRoutes = config.ignoreRoutes;
var tokenValidator = function(req,res,cb){
    var token = req.headers.token
    var id = req.headers.id
    if(ignoreRoutes.indexOf(req.path)>=0){
        cb()
    }else if(token && id){
        db.get().collection('tokens').find({"token":token}).limit(1).toArray().then(function(docs){
            if(docs.length === 0 || id != docs[0].id){
                res.json({error:"Invalid Token"})
            }else{
                cb()
            }
        })
    }else{
        res.json({error:"Missing Data"})
    }
}
module.exports = function(req,res,next){
    tokenValidator(req,res,next);
}