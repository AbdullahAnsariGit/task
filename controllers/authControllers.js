const User = require("../models/User");
const Otp = require("../models/Otp");
const bcrypt = require("bcrypt");
const sendEmail = require("../config/mailer");
const jwt = require("jsonwebtoken");

const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      confirm_password,
      user_device_type,
      user_device_token,
      role,
    } = req.body;
    const emailValidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const passwordValidation =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;

    if (!name)
      return res.status(422).json({ status: 0, message: "Name is required" });
    // Validation Checks
    if (!email)
      return res.status(422).json({ status: 0, message: "Email is required" });
    if (!email.match(emailValidation)) {
      return res
        .status(400)
        .json({ status: 0, message: "Invalid email address" });
    }
    if (!password)
      return res
        .status(422)
        .json({ status: 0, message: "Password is required" });
    if (!password.match(passwordValidation)) {
      return res.status(400).json({
        status: 0,
        message:
          "Password must be at least 8 characters long and include uppercase, lowercase, numeric, and special characters",
      });
    }
    if (!confirm_password)
      return res
        .status(422)
        .json({ status: 0, message: "Confirm Password is required" });

    if (password !== confirm_password)
      return res
        .status(400)
        .json({ status: 0, message: "Passwords do not match" });

    if (!role)
      return res
        .status(422)
        .json({ status: 0, message: "role is required, user or admin" });

    //Check if user already registered
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      const saltRounds = 12;
      const hashPassword = await bcrypt.hash(req.body.password, saltRounds);

      const user = new User({
        name,
        email,
        password: hashPassword,
        // verification_code: verificationCode,
        // otp_expiration: otpExpiration, //Expire otp timer
        user_device_type,
        user_device_token,
        role,
      });

      await user.save();
      if (user) {
        //Generate otp
        const verificationCode =
          Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
        //Expire otp timer
        const otpExpiration = new Date();
        otpExpiration.setMinutes(otpExpiration.getMinutes() + 1); // Return current minute plus 1 min
        //Comment code related to otp
        let subject = "For Registration Verification code";
        let code = verificationCode;
        // Here opt work
        const otp = new Otp({
          email,
          verification_code: verificationCode,
          otp_expiration: otpExpiration,
        });
        await otp.save();

        await sendEmail(name, email, subject, code);
        return res.status(200).json({
          status: 1,
          message: "User registered successfully",
          data: user,
        });
      }
    } else {
      return res.status(400).json({ status: 0, message: "User already exist" });
    }
  } catch (err) {
    console.log("err", err);
    return res
      .status(500)
      .json({ status: 0, message: "Internal Server Error" });
  }
};

const login = async (req, res, next) => {
  const { email, password, role } = req.body;
  const emailValidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (!email)
    return res.status(422).json({
      status: 0,
      message: "Email is required",
    });
  if (!email.match(emailValidation))
    return res.status(422).json({
      status: 0,
      message: "Invalid email address",
    });
  if (!password)
    return res.status(422).json({
      status: 0,
      message: "Password is required",
    });
  if (!role)
    return res.status(422).json({
      status: 0,
      message: "Role is required",
    });

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({
        status: 0,
        message: "User not found. Please register first.",
      });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 0,
        message: "Invalid credentials. Please try again.",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role }, // Payload
      process.env.JWT_SECRET_KEY, // Secret key
      { expiresIn: "1h" } // Token expiration
    );
    return res.status(200).json({
      status: 1,
      message: "Login successful",
      token,
      data: user,
    });
  } catch (err) {
    console.log("err", err);
    return res
      .status(500)
      .json({ status: 0, message: "Internal Server Error" });
  }
};

const verifyOtp = async (req, res, next) => {
  try {
    const { email, verification_code } = req.body;
    if (!email)
      return res
        .status(400)
        .json({ status: 0, message: "Email code is required" });
    if (!verification_code)
      return res
        .status(400)
        .json({ status: 0, message: "Otp code is required" });
    const otpRecord = await Otp.findOne({ email });
    console.log("otp record", otpRecord);
  } catch (err) {
    console.log("err", err);
    return res
      .status(500)
      .json({ status: 0, message: "Internal Server Error" });
  }
};

module.exports = { register, login, verifyOtp };
