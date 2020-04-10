const mongoose = require("mongoose");

const courseFeeSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, "Please Enter Amount"],
  },
  coursename: {
    type: mongoose.Schema.ObjectId,
    ref: "Course",
    required: true,
  },
});
// Reverse populate with virtuals
courseFeeSchema.virtual("course", {
  ref: "course",
  localField: "_id",
  foreignField: "CourseFee",
  justOne: false,
});
module.exports = mongoose.model("coursefee", courseFeeSchema);
