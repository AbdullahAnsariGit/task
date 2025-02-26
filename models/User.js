const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      lowercase: true,
      trim: true,
      match:
        /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    },
    password: {
      type: String,
      require: true,
    },
    // verification_code: {
    //   type: String,
    //   require: true,
    // },
    // otp_expiration: { type: Date, required: true },
    user_device_type: {
      type: String,
    },
    user_device_token: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "",
    },
  },
  { timestamps: true }
);
UserSchema.index({ otp_expiration: 1 }, { expireAfterSeconds: 0 });
const User = mongoose.model("User", UserSchema);

module.exports = User;
