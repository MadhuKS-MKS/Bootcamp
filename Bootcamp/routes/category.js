const express = require("express");

const router = express.Router();

const { check, validationResult } = require("express-validator");
const {
  getCategories,
  addCategory,
  deleteCategory,

  // updateSyllabus,
} = require("../controllers/category");
const { protect, authorize } = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");

const Category = require("../models/Category");

const courseRouter = require("./course");

// Re-route into other resource routers
router.use("/:categoryId/courses", courseRouter);

router
  .route("/")
  .get(advancedResults(Category), getCategories)
  .post(protect, authorize("admin"), addCategory);

router
  .route("/:categoryId")
  .delete(protect, authorize("admin"), deleteCategory);

module.exports = router;
