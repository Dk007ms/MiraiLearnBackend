// sendOTP signup login changePassword

// send otp
const User = require("../models/user");
const OTP = require("../models/otp");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const user = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.sendOTP = async (res, req) => {
  try {
    // fetch email from request ki body
    const { email } = req.body;

    // check if user exist
    const checkUserPresent = await User.findOne({ email });

    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already exists",
      });
    }

    var otp = otpGenerator(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const result = await OTP.findOne({ otp: otp });

    while (result) {
      otp = otpGenerator(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });
    }

    const otpPayload = { email, otp };

    // create an entry for otp
    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// signup

exports.signup = async (res, req) => {
  try {
    const {
      firstName,
      lastName,
      email,
      accountType,
      contactNumber,
      otp,
      password,
    } = req.body;

    // check if User exist

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(401).json({
        success: false,
        message: "User already exists",
      });
    }

    // find most recent otp
    const recentOTP = await OTP.find(
      { email }.sort({ createdAt: -1 }.limit(1))
    );
    console.log(recentOTP);
    // validate OTP

    if (recentOTP.length === 0) {
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    } else if (otp !== recentOTP.otp) {
      // invalid otp
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // hash password (salting)

    const hashedPassword = await bcrypt.hash(password, 10);

    // create DB entry

    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    const User = await user.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      additionalDetails: profileDetails._ID,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      User,
    });
  } catch (error) {
    console.log(error),
      res.status(500).json({
        success: false,
        message: "User cannot be registered please try again",
      });
  }
};

exports.login = async (req, res) => {
  try {
    // get data from req body
    // validation of data
    // check if user exist
    // token generate JWT, after password matching
    // create cookie and send response

    const { email, password } = req.body;

    const User = await User.findOne({ email });

    if (!User) {
      return res.status(401).json({
        success: false,
        message: "User is not registered",
      });
    }

    // password matching

    if (await bcrypt.compare(password, User.password)) {
      const payload = {
        email: User.email,
        id: User._id,
        accountType: User.accountType,
      };
      const token = jwt.sign(payload, process.env, JWT_SECRET, {
        expiredin: "2h",
      });
      User.token = token;
      User.password = undefined;

      // create cookie and send response

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        User,
        message: "Logged in Successfully",
      });
    }
    else{
        return res.status(401).json({
            success:false,
            message:"Password is incorrect",
        });
    }

    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
        success:false,
        message:"Login failure, please try again"
    })
  }
};


// changePassword

exports.changePassword=async(req,res)=>{

}