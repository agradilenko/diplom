const express = require("express");
const router = express.Router();

const Gosts = require("../../models/Gost");

// @route GET api/gosts/
// @desc Get all gosts
// @access Private
router.get(
  "/",
  // passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    Gosts.find().then((gost) =>
      res.json(gost.map((item) => ({ value: item._id, label: item.name })))
    );
  }
);

module.exports = router;
