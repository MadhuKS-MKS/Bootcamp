const path = require("path");
const ErrorResponse = require("../utils/errorResponse");

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
    });
    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc      Get single course
// @route     GET /api/category/:categoryId/courses/:courseId
// @access    Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const courses = await Course.findById(req.params.courseId);
  if (!courses.free) {
    const course = await CourseFee.find({ courseid: courses.id }).populate({
      path: "courseid",
    });
    res.status(200).json({
      success: true,
      data: course,
    });
  } else {
    if (!courses) {
      return next(
        new ErrorResponse(`No course with the id of ${req.params.courseId}`),
        404
      );
    }

    res.status(200).json({
      success: false,
      data: courses,
    });
  }
});

// @desc      Add course
// @route     POST /api/category/:categoryId/courses/
// @access    Private
exports.addCourse = asyncHandler(async (req, res, next) => {
  const amount = req.body.amount;
  req.body.user = req.user.id;
  if (!req.body.free) {
    const course = {
      title: req.body.title,
      description: req.body.description,
      weeks: req.body.weeks,
      free: req.body.free,
      syllabus: req.body.syllabus,
      categoryid: req.params.categoryId,
      user: req.body.user,
    };
    const courses = await Course.create(course);

    const fee = { amount: amount, courseid: courses.id };
    const courseFee = await CourseFee.create(fee);

    res.status(200).json({
      success: true,
      data: course,
      fee: courseFee,
    });
  } else {
    const courses = {
      title: req.body.title,
      description: req.body.description,
      weeks: req.body.weeks,
      free: req.body.free,
      syllabus: req.body.syllabus,
      categoryid: req.params.categoryId,
      user: req.body.user,
    };
    const course = await Course.create(courses);
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
  const course = await Course.findByIdAndDelete(req.params.courseId);
  const courseFee = await CourseFee.findByIdAndDelete(req.params.courseId);
  // await course.remove();
  // await courseFee.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
// @desc      Upload photo for course
// @route     PUT /api/v1/category/:categoryId/courses/:courseId/photo
// @access    Private
exports.CoursePhotoUpload = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);

  // if (!course) {
  //   return next(
  //     new ErrorResponse(
  //       `Course not found with id of ${req.params.courseId}`,
  //       404
  //     )
  //   );
  // }

  // Make sure user is bootcamp owner
  // if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
  //   return next(
  //     new ErrorResponse(
  //       `User ${req.params.courseId} is not authorized to update this course`,
  //       401
  //     )
  //   );
  // }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `photo_${course._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Course.findByIdAndUpdate(req.params.courseId, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});

// @desc      Upload photo for course
// @route     PUT /api/v1/category/:categoryId/courses/:courseId/photo
// @access    Private
exports.CourseVideoUpload = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);

  if (!course) {
    return next(
      new ErrorResponse(
        `Course not found with id of ${req.params.courseId}`,
        404
      )
    );
  }

  // Make sure of owner
  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.courseId} is not authorized to update this course`,
        401
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }
  for (var i = 0; i < req.files.length; i++) {
    const file = req.files[i];

    // Make sure the video is a photo
    // if (!file.mimetype.startsWith("video")) {
    //   return next(new ErrorResponse(`Please upload an video file`, 400));
    // }

    // Check filesize
    // if (file.size > process.env.MAX_FILE_UPLOAD) {
    //   return next(
    //     new ErrorResponse(
    //       `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
    //       400
    //     )
    //   );
    // }

    // Create custom filename
    // file.name = `video_${course._id}${path.parse(file.name).ext}`;

    // file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    //   if (err) {
    //     console.error(err);
    //     return next(new ErrorResponse(`Problem with file upload`, 500));
    //   }
    const syllabus = [
      {
        title: req.body.title,
        description: req.body.description,
        video: file.name,
      },
    ];
    // const data = await Course.findByIdAndUpdate(req.params.courseId, {
    //   syllabus: syllabus[i],
    // });

    res.status(200).json({
      success: true,
      data: file.name,
    });
    // });
  }
});
