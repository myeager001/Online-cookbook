var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);
var url = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/onlineCookbook';

/* GET home page. */
router.put('/updatefavorite', function(req, res, next){
  console.log(req.body);
  mongodb.MongoClient.connect(url, function(err, db) {
    var users = db.collection('users');
    var id = mongodb.ObjectId(req.decoded._id)
    users.update(
       { _id: id, "recipies.name": req.body.name },
       { $set: { "recipies.$" : req.body } }
    )
  })
  res.json({success: true, message: 'updated that shit!'})
})

router.delete('/:name', function(req, res, next){
  console.log(req.params.name);
  mongodb.MongoClient.connect(url, function(err, db) {
    var users = db.collection('users');
    var id = mongodb.ObjectId(req.decoded._id)
    users.update(
        {'_id': id},
        { $pull: { "recipies" : { name: req.params.name } } },
    false,
    true
    );
    })
    res.json({success: true, message: 'deleted that shit!'})
})

router.post('/', function(req, res, next) {
  console.log(req.decoded._id);
  if(!req.body.url || !req.body.name || req.body.tags.length>3){
    res.json({ success: false, message: 'Invalid url/recipe name or to many tags.' })
  }else{
    var recipe = {
      favorite: true,
      name: req.body.name,
      url: req.body.url,
      tags: req.body.tags,
    }
    mongodb.MongoClient.connect(url, function(err, db) {
      var users = db.collection('users');
      var id = mongodb.ObjectId(req.decoded._id)
      users.update(
        { _id: id },
        { $push: { recipies: recipe} },
        function(err, update){
          if (err) throw err
          res.json({ success: true, message: 'Added recipie!' });
        });
      })
  }
});

router.get('/', function(req, res, next) {

  var id = mongodb.ObjectId(req.decoded._id)
  mongodb.MongoClient.connect(url, function(err, db) {
    var users = db.collection('users');
      users.findOne({_id: id}, function(err, user){
        console.log(user)
        res.json(user)
      })
  });
});

module.exports = router;
