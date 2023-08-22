const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    agency_name: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },

  },
  { timestamps: true, versionKey: false }
);

const User = model('User', userSchema);

module.exports = User;
