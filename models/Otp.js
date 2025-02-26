const mongoose = require("mongoose");

const OtpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    verification_code: { type: String, required: true },
    otp_expiration: { type: Date, required: true },
  },
  { timestamps: true }
);

// TTL index to auto-delete expired OTP records
OtpSchema.index({ otp_expiration: 1 }, { expireAfterSeconds: 0 });

const Otp = mongoose.model("Otp", OtpSchema);

module.exports = Otp;
