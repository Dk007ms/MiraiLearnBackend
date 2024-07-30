const Profile = require("../models/profile");

exports.updateProfile = async (req, res) => {
  try {
    // get Data
    const { dateOfBirth = "", about = "", gender } = req.body;
    // getUserId
    const id = req.User.id;
    // validation
    if (!contactNumber || !gender) {
      return res.status(401).json({
        success: false,
        message: "Fields missing",
      });
    }

    // find Profile
    const UserDetails = await User.findById(id);
    const profileId = UserDetails.additionalDetails;
    const profileDetails = await Profile.findById({ profileId });

    // update Profile
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.gender = gender;
    profileDetails.contactNumber = contactNumber;
    await profileDetails.save();
    // return response
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profileDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Profile Updation failed",
    });
  }
};


// delete Account
// explore how can we schedule this deletion operation 

exports.deleteAccount =async(req,res)=>{
    try {
        // get userID
        const id=req.User.id;
        // validation
        const userdetail=await User.findById(id);
        if(!userdetail){
            return res.status(401).json({
                success:false,
                message:"User not found",
            });
        }
        // delete profile
        await Profile.findByIdAndDelete({_id:UserDetails.additionalDetails});

        // HW uneroll user from all enrolled courses

        // delete User
        await User.findByIdAndDelete({id:id});

        // return response
        return res.status(200).json({
            success:true,
            message:"User deleted successfully"
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Delete operation failed",
            error:error.message,
        })
    }
}

exports.getAllUserDetails=async(req,res)=>{
    try {
        // get id
        const id=req.user._id;

        // validation and get user Details
        const userDetails =await User.findById(id).populate("additionalDetails").exec();

        // return response
        return res.status(200).json({
            success:true,
            message:"User data fetched successfully",
            userDetails,
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed fetching Details",
            error:error.message,
        })
    }
}