const mongoose=require("mongoose");
const Tag=require("../models/tags");

// create tag ka handler function

exports.createTaag=async (req,res)=>{
    try {
        const {name,description}=req.body;

        if(!name || description){
            return res.status(400).json({
               success:false,
               message:"All fields required",
            });
        }

        // create entry in DB

        const tagDetails= await Tag.create({
            name:name,
            description:description,
        });
        console.log(tagDetails);

        // return response
         return res.status(200).json({
            success:true,
            message:"Tag created successfully"
         })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

// get all tags
exports.showAllTags=async (req,res)=>{
    try {
        const allTags=await Tag.find({},{name:true,description:true});

        return res.status(200).json({
            success:true,
            message:"All tags retured successfully",
            allTags
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          success: false,
          message: error.message,
        });
    }
}

