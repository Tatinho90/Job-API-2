const mongoose = require("mongoose");

const JobSchema = mongoose.Schema({
    company:{
        type: String,
        required: [true, "Please provide company name"],
        maxlength: 50
    },
    position: {
        type: String,
        required: [true, `Please provide a position name`],
        maxlength: 100
    },
    status:{
        type: String,
        enum: ["interview", "declined", "pending"],
        default: "pending"
    },
    createdBy:{
        // This is how we'll match the job to a user (so that users only see their own jobs)
        type: mongoose.Types.ObjectId,
        ref: "Users",
        required: [true, "Please provide user"]
        }
}, {timestamps: true})

module.exports = mongoose.model("Job", JobSchema)