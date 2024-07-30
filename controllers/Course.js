const mongoose = require("mongoose");
const Course = require("../models/Course");
const Tag = require("../models/tags");
const User = require("../models/user");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// createCourse handler function

exports.createCourse = async (req, res) => {
  try {
    // fetch all data

    const { courseName, description, whatYouWillLearn, price, tag } = req.body;

    // get  thumbnail
    const thumbnail = req.files.thumbnailImage;

    // validation
    if (
      !courseName ||
      !description ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
      !thumbnail
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // check for instructor id

    const userId = req.User.id;
    const instructorDetails = await User.findById(userId);

    
    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor Details not found",
      });
    }

    // check given tag is valid or not
    const tagDetails = await Tag.findById({ tag });

    if (!tagDetails) {
      return res.status(404).json({
        success: false,
        message: "Tag details not found",
      });
    }

    // upload Image on cloudinary

    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    // create an entry for new COurse

    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn: whatYouWillLearn,
      price,
      tag: tagDetails._id,
      thumbnail: thumbnailImage.secure_url,
    });

    // add new course to the userSchema of instructor

    await User.findByIdAndUpdate(
      { id: instructorDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    // update tag schema
    // Todo HW

    return res.status(200).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};

// getAllCourses handler function

exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      }
    )
      .populate("instructor")
      .exec();

    return res.status(200).json({
      success: true,
      message: "Data for all courses fetched successfully",
      data: allCourses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error while fetching data",
    });
  }
};
