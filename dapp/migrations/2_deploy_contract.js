var DeathBook = artifacts.require("./DeathBook.sol");

module.exports = function(deployer) {
  deployer.deploy(DeathBook);
};
