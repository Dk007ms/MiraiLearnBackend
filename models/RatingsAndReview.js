const mongoose=require("mongoose");

const RatingAndReviews=new mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    },

    rating:{
        type:String,
        required:true,
    },
    review:{
        type:String,
        required:true,
    }
});

module.exports = mongoose("RatingAndReviews", RatingAndReviews);