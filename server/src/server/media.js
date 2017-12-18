var express = require('express');
var router = express.Router();

var models = require('../common/models');
var i18n = require('../common/message_i18n');
var fs = require('fs');
var md5 = require('md5');
var passport = require('passport')
//var formidable = require('formidable');
var fileUpload = require('express-fileupload');
var encryptor = require('file-encryptor');

/** ACTION UPLOAD FILES **/
router.post('/upload', passport.authenticate('jwt', { session: false }), function(req, res) {
  if (!req.files) {
    console.log("Không tìm thấy");
    res.send(models.ResponseEntity.errorCode('04').message(i18n.FILE_UPLOAD_ERROR).data(null).build());
  }

  var fk = req.files.images;
  var uid = req.user._id;
  var hostname = "http://" + req.headers.host;

  var dir = './temp/' + uid;
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }
  var ex = readExtension(fk.name);
  var name = (new Date).getTime() + '_' + fk.name;
  name = md5(name) + "." + ex;
  var stock = dir + '/' + name;
  fk.mv(stock, function(err) {
    if (err) {
      console.log(err);
      res.send(models.ResponseEntity.errorCode('04').message(i18n.FILE_UPLOAD_ERROR).data(err).build());
    } else {
      // var encryptFile = stock.replace(/\.[^/.]+$/, "");
      // encryptor.encryptFile(stock, encryptFile + ".dat", req.user.hash_key, function(err) {
      //   if (err) {
      //     res.send(models.ResponseEntity.errorCode('07').message(i18n.ENCRYPTOR_ERROR).data(err).build());
      //   } else {
      //     var url = hostname + "/api/media/read/" + name;
      //     res.send(models.ResponseEntity.errorCode('00').message(i18n.SUCCESS).data({url:url}).build());
      //     fs.unlink(stock);
      //   }
      // });

      var url = hostname + "/api/media/read/" + uid + "/" + name;
      res.send(models.ResponseEntity.errorCode('00').message(i18n.SUCCESS).data({url:url}).build());
    }
  });

});

//passport.authenticate('jwt', { session: false })
router.get('/read/:userId/:name', function(req, res) {
  var uid = req.params.userId;
  var dir = './temp/' + uid + '/' + req.params.name;

  var type = readExtension(req.params.name);

  if (!fs.existsSync(dir)){
    res.send(models.ResponseEntity.errorCode('06').message(i18n.FILE_NOT_FOUND).data(null).build());
  } else {
    fs.readFile(dir, function(err, data) {
      if (err) {
        console.log(err);
        res.send(models.ResponseEntity.errorCode('04').message(i18n.FILE_UPLOAD_ERROR).data(err).build());
      } else {
        console.log('==> ' + type);
        if (type == 'png' || type == 'jpg' || type == 'jpeg') {
          res.set({'Content-Type': 'image/jpeg|image/png'});
        } else if (type == 'pdf') {
          res.set({'Content-Type': 'application/pdf'});
        } else if (type == 'mp4' || type == 'avi') {
          res.set({'Content-Type': 'video/mp4'});
        } else if (type == 'mp3') {
          res.set({'Content-Type': 'audio/mpeg'});
        }

        res.send(data);
        res.end();
      }
    });
  }
});

function readExtension(name) {
  var re = /(?:\.([^.]+))?$/;
  return re.exec(name)[1];
}

module.exports = router;
