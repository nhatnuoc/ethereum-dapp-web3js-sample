var express = require('express');
var router = express.Router();

var blockChain = require('../common/web3');

/* GET home page. */
router.get('/total-people-death', function(req, res, next) {

  blockChain.getTotalPeopleDeath(function (result, error){
    res.send({total: result,error: error});
  });
});

router.post('/add-confirm-key', function(req, res, next){
   blockChain.addConfirmKeyForPeople(req.body.hash_key, req.body.confirmKey,function (result, error){
      res.send({result: result, error: error});
   });
});

router.post('/people-dead', function(req, res, next){
   blockChain.havePeopleDeath(req.body.hash_key, req.body.confirmKey, req.body.data, function (result, error){
      res.send({result: result, error: error});
   });
});

router.get('/find-dead-people/:hash', function(req, res, next){
   blockChain.findPeopleDeathByHashKey(req.params.hash, function (result, error){
      res.send({result: result, error: error});
   });
});

module.exports = router;
