var express = require('express');
var router = express.Router();

var models = require('../common/models');
var i18n = require('../common/message_i18n');
var md5 = require('md5');
var ObjectId = require('mongoose').Types.ObjectId;
var QRCode = require('qr-image');
var fs = require('fs');

var jwt = require('jsonwebtoken');
var passport = require('passport');
var passportJWT = require('passport-jwt');
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;
var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
jwtOptions.secretOrKey = 'death-book';

var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  console.log('payload received', jwt_payload);
  // usually this would be a database call:
  var query = models.User.findOne({_id: new ObjectId(jwt_payload.id)});

  query.exec(function(err, user) {
    if (err) {
      next(null, false);
    } else if (user){
      next(null, user);
    } else {
      next(null, false);
    }
  });
});

passport.use(strategy);

/* User register account */
router.post('/register', function(req, res) {
  var email = req.body.email;
  var query = models.User.findOne({email: email});
  var hostname = "http://" + req.headers.host;

  query.exec(function(err, user) {
    if (err) {
      res.send(models.ResponseEntity.errorCode('01').message(i18n.DATABASE_ERROR_TRANSACTION).data(err).build())
    } else if (user) {
      res.send(models.ResponseEntity.errorCode('02').message(i18n.USER_ALREADY_EXISTS).data(null).build())
    } else {
      var qrName = md5(req.body.email + "##" + (new Date()));


      models.User.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        hash_key: md5(new Date()),
        email: req.body.email,
        password: md5(req.body.password),
        avatar: req.body.avatar,
        identify_card: req.body.identify_card,
        assets_key: [],
        created_date: new Date(),
        updated_date: new Date()
      }, function(err, data) {
        if (err) {
          res.send(models.ResponseEntity.errorCode('01').message(err.message).data(err).build())
        } else {

          var uid = data._id;
          console.log("Insert done with uid: " + uid);

          var dir = './temp/' + uid;
          if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
          }

          var qrSvg = QRCode.image(data._id.toString(), {type: 'png'});
          qrSvg.pipe(require('fs').createWriteStream(`./temp/${uid}/qrCode.png`));
          var qrCodeUrl = hostname + `/api/media/read/${uid}/qrCode.png`;


          models.User.update({_id: data._id}, {$set: {qr_code: qrCodeUrl}}, function(err, result){
            if (err) {
                res.send(models.ResponseEntity.errorCode('01').message(err.message).data(err).build())
            }
            var token = jwt.sign({id: data._id}, jwtOptions.secretOrKey);
            data.qr_code = qrCodeUrl;
            res.send(models.ResponseEntity.errorCode('00').message(i18n.SUCCESS).data({access_token: token, user: data}).build())
          });
        }
      });
    }
  });
});

/* Action login */
router.post('/login', function(req, res) {
  var query = models.User.findOne({email: email});

  var email = req.body.email;
  var password = req.body.password;

  var query = models.User.findOne({email: email});

  query.exec(function(err, user) {
    if(err) {
      res.send(models.ResponseEntity.errorCode('01').message(i18n.DATABASE_ERROR_TRANSACTION).data(null).build())
    } else if (user.password !== md5(password)){
      res.send(models.ResponseEntity.errorCode('02').message(i18n.WRONG_PASSWORD).data(null).build())
    } else {
        var token = jwt.sign({id: user.id}, jwtOptions.secretOrKey);
        res.send(models.ResponseEntity.errorCode('00').message(i18n.SUCCESS).data({access_token: token, user: user}).build())
    }
  });

});

/* Get profile user */
router.get('/me', passport.authenticate('jwt', { session: false }), function(req, res) {
  res.send(models.ResponseEntity.errorCode('00').message(i18n.SUCCESS).data(req.user).build());
});

/* Update profile user */
router.post('/update', passport.authenticate('jwt', { session: false }), function(req, res) {

})

module.exports = router;
