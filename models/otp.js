const mongoose=require("mongoose");
const mailSender = require("../utils/mailSender");

const OtpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    reuired: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 5 * 60,
  },
});

// function to send email

async function sendVerificationEmail(email,otp){
   try{
      const mailResponse=await mailSender(email,"Verification Email from MiraiLearning",otp);
      console.log("Email sent successfully");
   }catch(error){
    console.log("error while sending email",error);
   }
}

OtpSchema.pre("save", async function (next) {
  try {
    await sendVerificationEmail(this.email, this.otp);
    next(); // Proceed to save the document
  } catch (error) {
    next(error); // Pass the error to Mongoose's error handler
  }
});


module.exports=mongoose.model("otp",OtpSchema);