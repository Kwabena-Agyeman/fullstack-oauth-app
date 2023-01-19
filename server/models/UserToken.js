const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userTokenSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true },
  token: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: process.env.REFRESH_TOKEN_EXPIRY,
  }, // 15 days
});

const UserToken = mongoose.model('UserToken', userTokenSchema);

module.exports = UserToken;
