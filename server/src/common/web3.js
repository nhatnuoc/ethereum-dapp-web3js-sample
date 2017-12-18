var web3 = require("web3");
var parseJson = require('parse-json');
var contract = require("truffle-contract");
var path = require("path");
var configs = require("./configs");
var deathBookJson = require(path.join(__dirname,'../../../dapp/build/contracts/DeathBook.json'));
var  myweb3 =  new web3.providers.HttpProvider("http://localhost:8545");
var deathBookContract = contract(deathBookJson)
deathBookContract.setProvider(myweb3);
module.exports = {
     getTotalPeopleDeath: function(callback) {
       deathBookContract.deployed().then(function(instance){
          return instance.getTotalPeopleDeath.call().then(function(result){
             callback(JSON.parse(result),null);
          }).catch(function(error){
             callback(null,error);
          });
       });
    },
    addConfirmKeyForPeople: function(customerHash, confirmKey, callback) {
      if (customerHash != null  && confirmKey != null) {
        deathBookContract.deployed().then(function(instance) {
          return instance.addConfirmKey(customerHash,confirmKey,{from: configs.address}).then(function (result){
            callback(result,null);
          }).catch(function(error){
            callback(null,error);
          });
        });
      }
    },
    havePeopleDeath : function (customerHash, confirmKey, data, callback) {
      if (customerHash != null && confirmKey != null, confirmKey != null) {
        var transaction = {from: configs.address, gas: 500000 };
         deathBookContract.deployed().then(function(instance){
           return instance.havePeopleDeath(customerHash, confirmKey, data, transaction).then(function(result){
               callback(result,null);
           }).catch(function(error){
             callback(null,error);
           });
         });
      }
    },
    getConfirmKeyByCustomerHashKey: function (customerHash, callback) {
      if (customerHash != null) {
        deathBookContract.deployed().then(function(instance){
          return instance.getConfirmKey(customerHash).then(function(result){
            callback(result,null);
          }).catch(function(error){
            callback(null,error);
          });
        });
      }
    },
    findPeopleDeathByHashKey: function (customerHash, callback) {
      if (customerHash != null) {
        deathBookContract.deployed().then(function(instance){
          console.log(customerHash);
          return instance.findPeopleData(customerHash).then(function(result){
            callback(result,null);
          }).catch(function(error){
            console.log(error);
            callback(null,error);
          });
        });
      }
    }
}
