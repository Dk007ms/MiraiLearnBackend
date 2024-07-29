const mongoose =require("mongoose");

const Course =new mongoose.Schema({

    courseName:{
        type:String,
    },
    courseDescription:{
        type:String,
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
    },
    whatYouWillLearn:{
        type:String,
        trim:true,
    },
    courseContent:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Section"
        }
    ],
    ratingAndReviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"RatingAndReview",
        }
    ],

    price:{
        type:Number,
    },
    thumbnail:{
        type:String,
    },
    tag:{

        type:mongoose.Schema.Types.ObjectId,
        ref:"Tag",
    },
    studentsEnrolled:[
        {
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"User",
        }
    ]
})

module.exports=mongoose.model("Section",sectionSchema);