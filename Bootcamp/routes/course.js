const express = require("express");
const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
  CoursePhotoUpload,
} = require("../controllers/course");

const Course = require("../models/Course");

const router = express.Router({ mergeParams: true });

const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

router
  .route("/:courseId/photo")
  .put(protect, authorize("admin"), CoursePhotoUpload);

router
  .route("/")
  .get(
    advancedResults(Course, {
      path: "category",
      select: "name",
    }),
    getCourses
  )
  .post(protect, authorize("admin"), addCourse);

router
  .route("/:courseId")
  .get(getCourse)
  .put(protect, authorize("admin"), updateCourse)
  .delete(protect, authorize("admin"), deleteCourse);

module.exports = router;
