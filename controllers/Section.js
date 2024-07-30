const Section = require("../models/section");
const Course = require("../models/Course");

exports.createSection = async (req, res) => {
  try {
    // data fetch
    const { sectionName, Course_Id } = req.body;
    if (!sectionName || !Course_Id) {
      return res.status(401).json({
        success: false,
        message: "Missing SectionName or courseID",
      });
    }
    // create Section
    const newSection = await Section.create({ sectionName });

    // update course with section ObjectId
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      {
        Course_Id,
      },
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    );
    // HW use populate to replace sections/subSections both in the updated CourseDetails

    // return response
    return res.status(200).json({
      success: true,
      message: "Section created successfully",
      updatedCourseDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Section cretion failed and returned with error",
      error: error.message,
    });
  }
};

exports.updateSection = async (req, res) => {
  try {
    // data input
    const { sectionName, sectionId } = req.body;
    // data validation
    if (!sectionName || !sectionId) {
      return res.status(401).json({
        success: false,
        message: "Missing details",
      });
    }

    // update data
    const section = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );

    // return res
    return res.status(200).json({
      success: true,
      message: "Section updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update course try again",
      error: error.message,
    });
  }
};

exports.deleteSection = async (req, res) => {
  try {
    // get ID -assuming that we are sending ID in params
    const { sectionId } = req.params;
    // use findbyIDandDelete
    await Section.findByIdAndDelete(sectionId);

    // Do we need to delete entry from courseSchema

    // return response
    return res.status(200).json({
      success: true,
      message: "Section deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete try again",
    });
  }
};
