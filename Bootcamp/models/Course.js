const mongoose = require("mongoose");
const slugify = require("slugify");

const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a Title"],
      unique: true,
      trim: true,
      maxlength: [50, "Name can not be more than 50 characters"],
    },
    slug: String,

    description: {
      type: String,
      required: [true, "Please add a description"],
      maxlength: [500, "Description can not be more than 500 characters"],
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
        // level: {
        //   type=String,
        //   enum:[]
        // },
        video: {
          type: String,
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
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
// Create Course slug from the name
CourseSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

module.exports = mongoose.model("Course", CourseSchema);
