var express = require('express');
var router = express.Router();

var models = require('../common/models');
var i18n = require('../common/message_i18n');
var passport = require('passport');
var ObjectId = require('mongoose').Types.ObjectId;
var cryptor = require('../common/cryptor');

router.post('/create', passport.authenticate('jwt', { session: false }), function(req, res) {

  console.log(req.body.content);
  var data = cryptor.encrypt(req.user.hash_key, req.body.content);

  models.Post.create({
    content: data,
    type: req.body.type,
    status: req.body.status,
    user: new ObjectId(req.user._id)
  }, function(err, data) {
    if (err) {
      res.send(models.ResponseEntity.errorCode('01').message(i18n.DATABASE_ERROR_TRANSACTION).data(err).build());
    } else {
      models.User.update({_id: new ObjectId(req.user._id)},
            {$push: {posts: new ObjectId(data._id)}},
            function(err) {
                res.send(models.ResponseEntity.errorCode('00').message(i18n.SUCCESS).data(data).build());
            }
          );
      }
  });

});

router.post('/update/:postId', passport.authenticate('jwt', { session: false }), function(req, res) {
  var postId = request.params.postId;

  models.Post.update({_id: new ObjectId(postId)}, {
    content: req.body.content,
    type: req.body.type,
    status: req.body.status,
    user: new ObjectId(req.user._id)
  }, function(err, data) {
    if (err) {
      res.send(models.ResponseEntity.errorCode('01').message(i18n.DATABASE_ERROR_TRANSACTION).data(err).build());
    } else {
      res.send(models.ResponseEntity.errorCode('00').message(i18n.SUCCESS).data(data).build());
    }
  });
});

router.get('/list', passport.authenticate('jwt', { session: false }), function(req, res) {
  models.User.findOne({_id: new ObjectId(req.user._id)})
    .select('posts')
    .populate({path: 'posts', options: {sort: {created_date: -1}}})
    .exec(function(err, data) {
      if (err) {
        res.send(models.ResponseEntity.errorCode('01').message(i18n.DATABASE_ERROR_TRANSACTION).data(err).build());
      } else {
        Array.from(data.posts).forEach(function(item) {
          var decr = cryptor.decrypt(req.user.hash_key, item.content);
          item.content = decr;
        })
        res.send(models.ResponseEntity.errorCode('00').message(i18n.SUCCESS).data(data).build());
      }
    });
});

router.delete('/delete/:postId', passport.authenticate('jwt', { session: false }), function(req, res) {
  models.Post.remove({
    _id: new ObjectId(req.params.postId),
    user: new ObjectId(req.user._id)
  }, function(err, data) {
    if (err) {
        res.send(models.ResponseEntity.errorCode('01').message(i18n.DATABASE_ERROR_TRANSACTION).data(err).build());
    }
    res.send(models.ResponseEntity.errorCode('00').message(i18n.SUCCESS).data(data).build());
  });
});

module.exports = router;
