pragma solidity ^0.4.18;

contract DeathBook {
  // These will be assigned at the construction
     // phase, where `msg.sender` is the account
     // creating this contract.
     address public owner = msg.sender;
     uint public countValue;

     //Struct death
     struct Death{
         //address peopleAddress;
         bytes32 key;
         bytes32 confirmKey;
         bytes32 data;
     }


     mapping(bytes32 => Death) private deathBook;
     mapping(bytes32 => bytes32) private confirmList;

     //Add confirm key onlyOwner(owner)
     function addConfirmKey(bytes32 remoteKey, bytes32 confirmKey) public returns (bool) {
         if (confirmKey.length > 0 && remoteKey.length > 0 ) {
             confirmList[remoteKey] = confirmKey;
             return true;
         }
        return false;
     }

     //Remove confirm key
     function removeConfirmKey(bytes32 remoteKey) public  returns (bool) {
         delete confirmList[remoteKey];
         return true;
     }


     //Function process when have people Death
     //Function onlyOwner smart contract must trigger
     function havePeopleDeath(bytes32 _key, bytes32 _confirmKey, bytes32 _data) public returns (bool) {
        bytes32 dbKey = confirmList[_key];
        require(dbKey == _confirmKey);
        var whoDeath = Death(_key,_confirmKey, _data);
        deathBook[_key] = whoDeath;
        ++countValue;
        delete confirmList[_key];
        return true;
     }

     //Get confirm key
     function getConfirmKey(bytes32 _key) public onlyOwner(owner) view returns (bytes32) {
         return confirmList[_key];
     }

     //Find total people with key
     function findPeopleData(bytes32 _key) public  onlyOwner(owner) view returns (bytes32,bytes32,bytes32) {
         return (deathBook[_key].key,deathBook[_key].confirmKey,deathBook[_key].data);
     }

      //Find total people death
     function getTotalPeopleDeath() public onlyOwner(owner) view returns (uint) {
         return countValue;
     }


     function changeOwner(address _newOwner) public onlyOwner(owner) {
         owner = _newOwner;
     }

     modifier onlyOwner(address _account) {
         require(msg.sender == _account);
         _;
     }
}
