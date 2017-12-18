var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/death-book', { useMongoClient: true });
var Schema = mongoose.Schema;

function ResponseEntity() {
  var errorCode: '00';
  var message: 'Success';
  var data: null;

  return {
    errorCode: function(err) {
      errorCode = err;
      return this;
    },

    message: function(msg) {
      message = msg;
      return this;
    },

    data: function(d) {
      data = d;
      return this;
    },

    build: function() {
      return {errorCode: errorCode, message: message, data: data}
    }
  }
}

var User = mongoose.model('User', new Schema({
    first_name: {type: String, required: false},
    last_name: {type: String, required: false},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    birth_date: {type: Date, required: false},
    death_date: {type: Date, required: false},
    avatar: {type: String, required: false},
    identify_card: {type: String, required: false},
    hash_key: {type: String, required: true},
    qr_code: {type: String, required: false},
    assets_key: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AssetKey'
    }],
    confirm_key: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ConfirmKey'
    },
    address_wallet: {type: String, required: false},
    posts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }],
    created_date: {type: Date, required: true, default: Date.now},
    updated_date: {type: Date, required: true, default: Date.now}
  })
);

var Post = mongoose.model('Post', new Schema({
    content: {type: String, required: true},
    type: {type: Number, required: true}, //0:letter, 1:pdf, 2:img, 3:video, 4:mp3
    status: {type: Number, required: true}, //0:public, 1:private
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    created_date: {type: Date, required: true, default: Date.now},
    updated_date: {type: Date, required: true, default: Date.now}
  })
);

var AssetKey = mongoose.model('AssetKey', new Schema({
    key: {type: String, required: true, unique: true},
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    qr_code: {type: String, required: false},
    created_date: {type: Date, required: true, default: Date.now},
    updated_date: {type: Date, required: true, default: Date.now}
  })
);

var ConfirmKey = mongoose.model('ConfirmKey', new Schema({
    key: {type: String, required: true, unique: true},
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    qr_code: {type: String, required: false},
    created_date: {type: Date, required: true, default: Date.now},
    updated_date: {type: Date, required: true, default: Date.now}
  })
);

var Transaction = mongoose.model('Transaction', new Schema({
    content: {type: String, required: false},
    trans_type: {type: String, required: false},
    trans_key: {type: String, required: false},
    request_data: {type: String, required: false},
    created_date: {type: Date, required: true, default: Date.now},
    updated_date: {type: Date, required: true, default: Date.now}
  })
);

module.exports = {
  ResponseEntity: new ResponseEntity(),
  User: User,
  Post: Post,
  AssetKey: AssetKey,
  ConfirmKey: ConfirmKey,
  Transaction: Transaction
};
