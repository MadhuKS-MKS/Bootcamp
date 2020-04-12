const mongoose = require("mongoose");

const courseFeeSchema = new mongoose.Schema({
  amount: {
    type: Number,
  },
  courseid: {
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
// Cascade delete coursesfee when a course is deleted
courseFeeSchema.pre("remove", async function (next) {
  console.log(`CourseFee being removed from Course ${this._id}`);
  await this.model("CourseFee").deleteMany({ course: this._id });
  next();
});
module.exports = mongoose.model("coursefee", courseFeeSchema);
