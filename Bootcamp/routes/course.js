const express = require("express");
const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,

  // updateSyllabus,
} = require("../controllers/course");

const Course = require("../models/Course");

const router = express.Router({ mergeParams: true });

const advancedResults = require("../middleware/advancedResults");

router
  .route("/")
  .get(
    advancedResults(Course, {
      path: "category",
      select: "name",
    }),
    getCourses
  )
  .post(addCourse);

router
  .route("/:courseId")
  .get(getCourse)
  .put(updateCourse)
  .delete(deleteCourse);
// router.route("/:id/syllabus");
// .put(updateSyllabus);

module.exports = router;
