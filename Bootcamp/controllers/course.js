const path = require("path");
const ErrorResponse = require("../util/errorResponse");

const Course = require("../models/Course");
const CourseFee = require("../models/CourseFee");
const asyncHandler = require("../middleware/async");

// @desc      Get courses
// @route     GET /api/courses
// @route     GET /api/category/:categoryId/courses
// @access    Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.categoryId) {
    const courses = await Course.find({
      categoryid: req.params.categoryId,
    }).populate({
      path: "coursename",
      populate: { path: "categoryid" },
    });
    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } else {
    res.status(200).json({ data: req.params });
  }
});

// @desc      Get single course
// @route     GET /api/category/:categoryId/courses/:courseId
// @access    Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await CourseFee.findById(req.params.courseId).populate({
    path: "coursename",
    populate: { path: "categoryid" },
  });

  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`),
      404
    );
  }

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc      Add course
// @route     POST /api/category/:categoryId/courses/
// @access    Private
exports.addCourse = asyncHandler(async (req, res, next) => {
  const amount = req.body.amount;
  if (req.body.free === "true") {
    const course = {
      title: req.body.title,
      description: req.body.description,
      weeks: req.body.weeks,
      free: req.body.free,
      syllabus: req.body.syllabus,
      categoryid: req.body.category,
    };
    const courses = await Course.create(course);

    const id = { _id: courses.id };
    const fee = { amount: amount, coursename: id };
    const courseFee = await CourseFee.create(fee);
    // res.status(200), json({ data: fee });
    // console.log(courseFee);
    res.status(200).json({
      success: true,
      datas: courses,
      data: courseFee,
    });
  } else {
    const course = await Course.create(req.body);
    res.status(200).json({
      success: true,
      data: course,
    });
  }
});

// @desc      Update course
// @route     PUT /api/category/:categoryId/courses/:courseId
// @access    Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  const amount = req.body.amount;
  if (req.body.amount) {
    course = await Course.findByIdAndUpdate(req.params.courseId, req.body, {
      new: true,
      runValidators: true,
    });
    // const id = { _id: req.params.courseId };
    const fee = { amount: amount };
    const courseFee = await CourseFee.findOneAndUpdate(
      { coursename: req.params.courseId },
      fee,
      {
        new: true,
        runValidators: true,
      }
    );
    // res.status(200), json({ data: fee });
    // console.log(courseFee);
    res.status(200).json({
      success: true,
      datas: course,
      data: courseFee,
    });
  } else {
    course = await Course.findByIdAndUpdate(req.params.courseId, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: false,
      data: course,
    });
  }
});

// @desc      Delete course
// @route     DELETE /api/category/:categoryId/courses/:courseId
// @access    Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);
  const courseFee = await CourseFee.findById(req.params.courseId);
  await course.remove();
  await courseFee.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// Syllabus

// // @desc      Update course
// // @route     PUT /api/category/:categoryId/courses/:courseId
// // @access    Private
// exports.updateSyllabus = asyncHandler(async (req, res, next) => {
//   const course = await Course.findById(req.params.id);

//   if (!course) {
//     return next(
//       new ErrorResponse(`Course not found with id of ${req.params.id}`, 404)
//     );
//   }

//   // if (!req.files) {
//   //   return next(new ErrorResponse(`Please upload a file`, 400));
//   // }

//   const file = req.file;

//   // course = await Course.findByIdAndUpdate(req.params.id, req.body, {
//   //   new: true,
//   //   runValidators: true,
//   // });

//   res.status(200).json({
//     success: true,
//     data1: req.body,
//     data: file,
//   });
// });

// // @desc      Upload photo for bootcamp
// // @route     PUT /api/v1/bootcamps/:id/photo
// // @access    Private
// exports.vendorsPhotoUpload = asyncHandler(async (req, res, next) => {
//   const file = req.files.file;

//   // Make sure the image is a photo
//   if (!file.mimetype.startsWith("image")) {
//     return next(new ErrorResponse(`Please upload an image file`, 400));
//   }

//   // Check filesize
//   if (file.size > process.env.MAX_FILE_UPLOAD) {
//     return next(
//       new ErrorResponse(
//         `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
//         400
//       )
//     );
//   }

//   // Create custom filename
//   file.name = `video_${path.parse(file.name).ext}`;

//   file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
//     if (err) {
//       console.error(err);
//       return next(new ErrorResponse(`Problem with file upload`, 500));
//     }

//     await Vendor.findByIdAndUpdate(req.params.id, { photo: file.name });

//     res.status(200).json({
//       success: true,
//       data: file.name,
//     });
//   });
// });
