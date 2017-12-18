var express = require('express');
var router = express.Router();

var models = require('../common/models');
var i18n = require('../common/message_i18n');
var passport = require('passport');
var sha256 = require('sha256');
var ObjectId = require('mongoose').Types.ObjectId;
var QRCode = require('qr-image');
var blockChain = require('../common/web3');

router.get('/generate', passport.authenticate('jwt', { session: false }), function(req, res) {
  var uid = req.user._id;
  var hostname = "http://" + req.headers.host;

  models.ConfirmKey.findOne({user: new ObjectId(req.user._id)}, function(err, confirmKey) {
    if (err) {
      res.send(models.ResponseEntity.errorCode('01').message(i18n.DATABASE_ERROR_TRANSACTION).data(err).build());
    } else if (confirmKey) {
      var renConfirmKey = sha256(new Date().getTime() + '##' + req.user._id);

      var qrSvg = QRCode.image(renConfirmKey, {type: 'png'});
      qrSvg.pipe(require('fs').createWriteStream(`./temp/${uid}/${renConfirmKey}_qrCode.png`));
      var qrCodeUrl = hostname + `/api/media/read/${uid}/${renConfirmKey}_qrCode.png`;

      models.ConfirmKey.update({
        _id: confirmKey._id
      }, {$set: {key: renConfirmKey, qr_code: qrCodeUrl}}, function(err, data){
        if (err) {
          res.send(models.ResponseEntity.errorCode('01').message(i18n.DATABASE_ERROR_TRANSACTION).data(err).build());
        }
        var userEncrypt = sha256(JSON.stringify(req.user));
        console.log("Encrypt user: " + userEncrypt);
        blockChain.addConfirmKeyForPeople(req.user.hash_key, renConfirmKey, function(result, error) {
          console.log("Call addConfirmKeyForPeople");

          if (error) {
            console.log(error);
            res.send(models.ResponseEntity.errorCode('10').message(i18n.BLOCKCHAIN_EXCEPTION).data(data).build());
          }

          console.log(result);
          confirmKey.key = renConfirmKey;
          confirmKey.qr_code = qrCodeUrl;
          res.send(models.ResponseEntity.errorCode('00').message(i18n.SUCCESS).data(confirmKey).build());
        })
      });

      //res.send(models.ResponseEntity.errorCode('01').message(i18n.CONFIRM_KEY_ALREADY_EXIST).data(null).build());
    } else {
        var confirmKey = sha256(new Date().getTime() + '##' + req.user._id);
        //if not exists, create new confirmKey;

        var qrSvg = QRCode.image(confirmKey, {type: 'png'});
        qrSvg.pipe(require('fs').createWriteStream(`./temp/${uid}/${confirmKey}_qrCode.png`));
        var qrCodeUrl = hostname + `/api/media/read/${uid}/${confirmKey}_qrCode.png`;

        models.ConfirmKey.create({
          key: confirmKey,
          user: new ObjectId(req.user._id),
          qr_code: qrCodeUrl
        }, function(err, data) {
          if (err) {
              res.send(models.ResponseEntity.errorCode('01').message(i18n.DATABASE_ERROR_TRANSACTION).data(err).build());
          }

          models.User.update({_id: new ObjectId(req.user._id)},
                {$set: {confirm_key: new ObjectId(data._id)}},
                function(err, user) {
                  var userEncode = sha256(JSON.stringify(user));
                  blockChain.addConfirmKeyForPeople(req.user.hash_key, confirmKey, function(result, error) {
                    if (error) {
                      res.send(models.ResponseEntity.errorCode('10').message(i18n.BLOCKCHAIN_EXCEPTION).data(data).build());
                    }
                    res.send(models.ResponseEntity.errorCode('00').message(i18n.SUCCESS).data(data).build());
                  })
                }
              );
          }
        );
    }

  });

});

router.get('/get', passport.authenticate('jwt', { session: false }), function(req, res) {
  models.User.findOne({_id: new ObjectId(req.user._id)})
    .select('confirm_key')
    .populate('confirm_key')
    .exec(function(err, data) {
      if (err) {
        res.send(models.ResponseEntity.errorCode('01').message(i18n.DATABASE_ERROR_TRANSACTION).data(err).build());
      } else {
        res.send(models.ResponseEntity.errorCode('00').message(i18n.SUCCESS).data(data).build());
      }
    });
});

router.post('/submit', function(req, res) {

  var key = req.body.key;

  models.ConfirmKey.findOne({key: key})
    .populate('user')
    .select('user')
    .exec(function(err, data) {
      if (err) {
        res.send(models.ResponseEntity.errorCode('01').message(i18n.DATABASE_ERROR_TRANSACTION).data(err).build());
      }

      console.log(data.user);
      var uid = data.user._id;

      var userEncode = sha256(JSON.stringify(data.user));
      blockChain.havePeopleDeath(data.user.hash_key, key, userEncode, function (result, error) {
        if (error) {
          console.log(error);
        }

        console.log(result);
        models.User.update({_id: new ObjectId(uid)}, { $set: { death_date: new Date()}}, function(err, data) {
          if (err) {
            res.send(models.ResponseEntity.errorCode('01').message(i18n.DATABASE_ERROR_TRANSACTION).data(err).build());
          }
          res.send(models.ResponseEntity.errorCode('00').message(i18n.SUCCESS).data(data).build());
        });
      });
  });

});

module.exports = router;
