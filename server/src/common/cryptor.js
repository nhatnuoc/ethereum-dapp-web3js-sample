var sha256 = require('sha256');
var NodeRSA = require('node-rsa');


var DEATH_BOOK_PRIVATE_KEY =
                      'MIIBOQIBAAJAVY6quuzCwyOWzymJ7C4zXjeV/232wt2ZgJZ1kHzjI73wnhQ3WQcL\n'+
                      'DFCSoi2lPUW8/zspk0qWvPdtp6Jg5Lu7hwIDAQABAkBEws9mQahZ6r1mq2zEm3D/\n'+
                      'VM9BpV//xtd6p/G+eRCYBT2qshGx42ucdgZCYJptFoW+HEx/jtzWe74yK6jGIkWJ\n'+
                      'AiEAoNAMsPqwWwTyjDZCo9iKvfIQvd3MWnmtFmjiHoPtjx0CIQCIMypAEEkZuQUi\n'+
                      'pMoreJrOlLJWdc0bfhzNAJjxsTv/8wIgQG0ZqI3GubBxu9rBOAM5EoA4VNjXVigJ\n'+
                      'QEEk1jTkp8ECIQCHhsoq90mWM/p9L5cQzLDWkTYoPI49Ji+Iemi2T5MRqwIgQl07\n'+
                      'Es+KCn25OKXR/FJ5fu6A6A+MptABL3r8SEjlpLc=\n';

function encrypt(hash_key, data) {
  //var key = sha256(DEATH_BOOK_PRIVATE_KEY + hash_key);
  var keyData = `-----BEGIN RSA PRIVATE KEY----- ${DEATH_BOOK_PRIVATE_KEY}${hash_key} -----END RSA PRIVATE KEY-----`;
  var rsa = new NodeRSA();
  rsa.importKey(keyData);
  return rsa.encrypt(data, 'base64');
}

function decrypt(hash_key, data) {
  var keyData = `-----BEGIN RSA PRIVATE KEY----- ${DEATH_BOOK_PRIVATE_KEY}${hash_key} -----END RSA PRIVATE KEY-----`;
  var rsa = new NodeRSA();
  rsa.importKey(keyData);
  return rsa.decrypt(data, 'utf8');
}

module.exports = {
  encrypt: encrypt,
  decrypt: decrypt
}
