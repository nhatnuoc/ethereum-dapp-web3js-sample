var express = require('express');
var router = express.Router();

var models = require('../common/models');
var i18n = require('../common/message_i18n');
var passport = require('passport');
var sha256 = require('sha256');
var ObjectId = require('mongoose').Types.ObjectId;
//var assert = require('assert');
var QRCode = require('qr-image');
var cryptor = require('../common/cryptor');
var blockChain = require('../common/web3');

router.get('/generate', passport.authenticate('jwt', { session: false }), function(req, res) {
  var uid = req.user._id;
  var assetsKey = sha256(new Date().getTime() + '##' + uid);
  var hostname = "http://" + req.headers.host;

  var qrSvg = QRCode.image(assetsKey, {type: 'png'});
  qrSvg.pipe(require('fs').createWriteStream(`./temp/${uid}/${assetsKey}_qrCode.png`));
  var qrCodeUrl = hostname + `/api/media/read/${uid}/${assetsKey}_qrCode.png`;

  models.AssetKey.create({
    key: assetsKey,
    user: new ObjectId(req.user._id),
    qr_code: qrCodeUrl
  }, function(err, data) {
    if (err) {
        res.send(models.ResponseEntity.errorCode('01').message(i18n.DATABASE_ERROR_TRANSACTION).data(err).build());
    }

    models.User.update({_id: new ObjectId(req.user._id)},
          {$push: {assets_key: new ObjectId(data._id)}},
          function(err) {
            blockChain.addConfirmKeyForPeople(req.user.hash_key, assetsKey, function(result, error) {
              if (error) {
                res.send(models.ResponseEntity.errorCode('10').message(i18n.BLOCKCHAIN_EXCEPTION).data(data).build());  
              }
              res.send(models.ResponseEntity.errorCode('00').message(i18n.SUCCESS).data(data).build());
            });
          }
        );
    }
  );

});

router.get('/list', passport.authenticate('jwt', { session: false }), function(req, res) {
  models.User.findOne({_id: new ObjectId(req.user._id)})
    .select('assets_key')
    .populate({path: 'assets_key', options: {sort: {created_date: -1}}})
    .exec(function(err, data) {
      if (err) {
        res.send(models.ResponseEntity.errorCode('01').message(i18n.DATABASE_ERROR_TRANSACTION).data(err).build());
      } else {
        res.send(models.ResponseEntity.errorCode('00').message(i18n.SUCCESS).data(data).build());
      }
    });
});

router.post('/delete/:id', passport.authenticate('jwt', { session: false }), function(req, res) {
  models.AssetKey.remove(
    {_id: new ObjectId(req.params.id), user: new ObjectId(req.user._id)}, function(err, data) {
      if (err) {
        res.send(models.ResponseEntity.errorCode('01').message(i18n.DATABASE_ERROR_TRANSACTION).data(err).build());
      }

      res.send(models.ResponseEntity.errorCode('00').message(i18n.SUCCESS).data(data).build());

    });
});

router.post('/submit', function(req, res) {

  var key = req.body.key;

  models.AssetKey.findOne({key: key})
    .populate('user')
    .select('user')
    .exec(function(err, data) {
      if (err) {
        res.send(models.ResponseEntity.errorCode('01').message(i18n.DATABASE_ERROR_TRANSACTION).data(err).build());
      }

      var uid = data.user._id;
      console.log(uid);

      models.User.findOne({_id: new ObjectId(uid)})
        .select('posts')
        .populate({path: 'posts', options: {sort: {created_date: -1}}})
        .exec(function(err, result)  {
          if (err) {
            res.send(models.ResponseEntity.errorCode('01').message(i18n.DATABASE_ERROR_TRANSACTION).data(err).build());
          }

          var posts = [];
          if (typeof data.user.death_date === 'undefined' | data.user.death_date == null) {

            posts = Array.from(result.posts).filter(function(item) {
              return item.status === 0;
            });

          } else {
            posts = result.posts;
          }

          Array.from(posts).forEach(function(item){
            var decr = cryptor.decrypt(data.user.hash_key, item.content);
            item.content = decr;
          });

          //result.posts = posts;

          res.send(models.ResponseEntity.errorCode('00').message(i18n.SUCCESS).data(posts).build());
        });

  })

});



module.exports = router;
