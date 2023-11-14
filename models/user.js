const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  username: { type: String, required: true, maxLength: 100 },
  password: { type: String, required: true, maxLength: 100 },
  favourites: Schema.Types.Mixed,
});

// Virtual for user "full" name.
UserSchema.virtual("name").get(function () {
  return this.family_name + ", " + this.first_name;
});

// Virtual for user URL.
UserSchema.virtual("url").get(function () {
  return "/user/" + this._id;
});

// Export model
module.exports = mongoose.model("User", UserSchema);
