const subSection = require("../models/subSection");
const section = require("../models/subSection");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.createSubsection = async (req, res) => {
  try {
    // fetch data
    const { section_Id, title, timeDuration, description } = req.body;
    // extract file /video
    const video = req.files.videoFiles;
    // validation
    if (!section_Id || !title || !description || !timeDuration || !video) {
      return res.status(401).json({
        success: false,
        message: "All fields required",
      });
    }
    // upload video to cloudinary
    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );
    // create a subsection
    const subSection = await subSection.create({
      title: title,
      timeDuration: timeDuration,
      description: description,
      videourl: uploadDetails.secure_url,
    });
    // update section with this subsection
    const updatedSection = await section.findByIdAndUpdate(
      { id: section_Id },
      { $push: { subSection: subSectionDetails._id } },
      { new: true }
    );

    // HW log updated section here after adding populate query

    // return response

    return res.status(200).json({
      success: true,
      message: "Created subsection successfully",
      updatedSection,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Subsection creation failed try again",
    });
  }
};

// HW update subsection 


// HW delete Subsection