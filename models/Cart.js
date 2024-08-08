const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  nfts: [{
    type: Schema.Types.ObjectId,
    ref: 'NFT'
  }]
});

module.exports = mongoose.model('Cart', CartSchema);
