const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Please add a course title"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    weeks: {
      type: String,
      required: [true, "Please add number of weeks"],
    },
    free: {
      type: Boolean,
      required: [true, "True or False "],
    },
    categoryid: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: true,
    },

    syllabus: [
      {
        title: {
          type: String,
          trim: true,
          required: [true, "Please add a title"],
        },
        description: {
          type: String,
          required: [true, "Please add a description"],
        },
        video: {
          type: String,
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    //   user: {
    //     type: mongoose.Schema.ObjectId,
    //     ref: "User",
    //     required: true,
    //   },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// Reverse populate with virtuals
CourseSchema.virtual("category", {
  ref: "Category",
  localField: "_id",
  foreignField: "course",
  justOne: false,
});

module.exports = mongoose.model("Course", CourseSchema);
