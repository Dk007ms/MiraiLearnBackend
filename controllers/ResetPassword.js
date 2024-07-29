const User = require("../models/user");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

// resetPasswordToken

exports.resetPasswordToken = async (req, res) => {
  // fetch email from req body
  // check if user exist with this email
  // generate token
  // update user by adding token expiration time
  // create url
  // send mail containing url and send response

  try {
    const { email } = req.body;

    // check if user exist with this email

    const user = User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Your Email is not registered with us",
      });
    }
    // generate token
    const token = crypto.randomUUID();

    // update user by adding token expiration time

    const updatedDetails = await user.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      { new: true }
    );

    // create url

    const url = `http://localhost:5173/update-password/${token}`;

    // send mail containing url and send response

    await mailSender(
      email,
      "Password Reset Link",
      `Password Reset Link:${url}`
    );
    return res.status(200).json({
      success: true,
      message: "Email for reset password sent successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error while sending password reset link",
    });
  }
};

exports.resetPassword = async (req, res) => {
  // data fetch
  // validation
  // getUserDetails from db using token
  // if no entry -invalid token
  // token time check
  // hash password
  // password update
  // return response

  try {
    // data fetch
    const { password, confirmPassword, token } = req.body;
    // validation
    if (password !== confirmPassword) {
      return res.status(401).json({
        success: false,
        message: "Password not matching",
      });
    }
    // getUserDetails from db using token

    const UserDetails = await User.findOne({ token: token });

    // if no entry -invalid token

    if (!UserDetails) {
      return res.status(400).json({
        success: false,
        message: "Token is invalid",
      });
    }

    //   token time check

    if (UserDetails.resetPasswordExpires < Date.now()) {
      return res.status(401).json({
        success: false,
        message: "Token is expired please regenrate your password",
      });
    }

    // hash password

    const hashedPassword = await bcrypt(password, 10);

    // password update

    await User.findOneAndUpdate(
      { token: token },
      { password: hashedPassword },
      { new: true }
    );

    // return response

    return res.status(200).json({
      success: true,
      message: "Password reset successfull",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error while password is being reset",
    });
  }
};
