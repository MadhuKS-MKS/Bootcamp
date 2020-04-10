const express = require("express");

const router = express.Router();

const { check, validationResult } = require("express-validator");

const Category = require("../models/Category");

const courseRouter = require("./course");

// Re-route into other resource routers
router.use("/:categoryId/courses", courseRouter);

// @route     GET api/category
// @desc      Get all category
// @access    Private
router.get("/", async (req, res) => {
  try {
    const category = await Category.find();
    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route     POST api/category
// @desc      Add new product
// @access    Private
router.post(
  "/",
  [check("name", "Please add a name").not().isEmpty()],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name } = req.body;
    try {
      const newcategory = new Category({
        name,
      });

      const category = await newcategory.save();

      res.json(category);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route     DELETE api/category/:categoryId
// @desc      Delete category
// @access    Private
router.delete("/:id", async (req, res) => {
  try {
    let category = await Category.findById(req.params.id);

    await Category.findByIdAndRemove(req.params.id);

    res.json({ msg: "Category removed" });
    res.json(category.user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
