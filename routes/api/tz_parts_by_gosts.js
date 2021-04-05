const express = require("express");
const router = express.Router();
const passport = require("passport");

const TzParts = require("../../models/TzPartByGOST");

// @route POST api/tz_parts_by_gosts/create
// @desc Create a new tz_part_by_gost
// @access Private
router.post(
  "/create",
  // passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const NEW_PART_BY_GOST = new TzParts({
      gost: req.body.gost,
      name: req.body.name,
      number: req.body.number,
    });

    NEW_PART_BY_GOST.save()
      .then((part_by_gost) => res.json(part_by_gost))
      .catch((err) => console.log(err));
  }
);

// @route GET api/tz_parts_by_gosts/:id
// @desc Get tz_parts_by_Gosts for specific gost
// @access Private
router.get(
  "/:id",
  // passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let id = req.params.id;

    TzParts.find({ gost: id }).then((parts_by_gost) =>
      res.json(
        parts_by_gost
          .map((part) => ({ id: part._id, name: part.name, number: part.number }))
          .sort(function (a, b) {
            return a.number - b.number;
          })
      )
    );
  }
);

module.exports = router;
