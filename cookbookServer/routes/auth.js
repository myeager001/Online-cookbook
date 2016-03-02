var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);
var url = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/onlineCookbook';
var jwt = require('jsonwebtoken');
require('dotenv').load()

/* GET home page. */
router.get('/', function(req, res, next) {

  mongodb.MongoClient.connect(url, function(err, db) {
    var users = db.collection('users');
    users.find().toArray(function (err, users) {
      res.json({ users: users });
    })
  });
});
router.post('/login', function(req, res, next){
  mongodb.MongoClient.connect(url, function(err, db) {
    if(err){
      db.close();
      res.end("Internal Server error")
    }
    var users = db.collection('users');
    users.findOne({
    username: req.body.username
  }, function(err, user) {
    if (err) throw err;
    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {
      console.log(user)
      // check if password matches
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {

        // if user is found and password is right
        // create a token
        var token = jwt.sign(user, process.env.JWT_SECRET, {
          expiresIn: 15778463 // expires in 6 months
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }

    }

  });
  });
})

router.post('/signup', function(req, res, next) {
  //make sure body contains all info
  if(req.body.password && req.body.email && req.body.username){
    mongodb.MongoClient.connect(url, function(err, db) {
      if(err){
        //if cant connect to db
        db.close();
        res.end("Internal Server error")
      }
      var users = db.collection('users');
      users.findOne({email: req.body.email}).then(function(results){
        if(results){
          //email already exist
          db.close();
          res.json({success: false, message: 'username or password already exist'})
        }
        else {
          users.findOne({username: req.body.username}).then(function(results){
            if(results){
              //username already exist
              db.close();
              res.json({success: false, message:'username or password already exist'})
            }
            //if ok insert into table
            else{
              users.insert({
                email: req.body.email,
                img_url: '',
                username: req.body.username,
                password: bcrypt.hashSync(req.body.password, salt),
                recipies: [],
              }, function (err, data) {
                db.close();
                res.end({success: true, message:"Successfully signed up! Please login"});
              })
            }
          })
        }
      })
    })
  }else{res.end({success: true, message:"Could not add user one or more field's were invalid"});}
});

router.put('/', function(req, res, next) {
  mongodb.MongoClient.connect(url, function(err, db) {
    var users = db.collection('users');
    var ID = mongodb.ObjectId(id)
    users.updateOne({_id: ID}, {$set: {
      img_url: req.body.img_url,
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, salt),
    }}, function (err, data) {
      res.json({ data: data });
    })
  })
});

router.delete('/:id', function(req, res, next) {
  var id = req.params.id;
  mongodb.MongoClient.connect(url, function(err, db) {
    var users = db.collection('users');
    var ID = mongodb.ObjectId(id);
    users.remove({_id: ID}, function (err, data) {
      res.json({ data: data });
    })
  })
});



module.exports = router;
