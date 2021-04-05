const express = require("express");
const router = express.Router();

const Tag = require("../../models/Tag");

// @route GET api/tags/
// @desc Get all tags
// @access Private
router.get(
  "/",
  // passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    Tag.find().then((tags) =>
      res.json(tags.map((item) => ({ value: item._id, label: item.name })))
    );
  }
);

// @route POST api/tags/create
// @desc Create a new tag
// @access Private
router.post(
  "/create",
  // passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const NEW_TAG = new Tag({
      name: req.body.name,
    });

    NEW_TAG.save()
      .then((tag) => res.json(tag))
      .catch((err) => console.log(err));
  }
);

module.exports = router;
