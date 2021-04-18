const express = require("express");
const router = express.Router();
const passport = require("passport");

const TzPart = require("../../models/TzPart");

// @route GET api/tz_parts/:id
// @desc Get part for specific tz
// @access Private
router.get(
  "/:id",
  // passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let id = req.params.id;

    TzPart.find({ tz: id }).then((parts) => res.json(parts));
  }
);

// @route GET api/tz_parts/:id/:part_by_gost
// @desc Get part for specific tz
// @access Private
router.get(
  "/:id/:part_by_gost",
  // passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let id = req.params.id;
    let part_by_gost = req.params.part_by_gost;
    TzPart.find({ tz: id, tz_by_gost: part_by_gost }).then((parts) =>
      res.json(parts)
    );
  }
);

// @route POST api/tz_parts/create
// @desc Create a new part
// @access Private
router.post(
  "/create",
  // passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const NEW_PART = new TzPart({
      tz: req.body.tz,
      tz_by_gost: req.body.tz_by_gost,
      content: req.body.content,
      rating: req.body.rating,
      number_of_uses: req.body.number_of_uses,
    });

    NEW_PART.save()
      .then((part) => res.json(part))
      .catch((err) => console.log(err));
  }
);

// @route PATCH api/tz_parts/update
// @desc Update an existing part
// @access Private
router.patch(
  "/update",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let partFields = {};

    partFields.tz = req.body.tz;
    partFields.tz_by_gost = req.body.tz_by_gost;
    partFields.content = req.body.content;
    partFields.rating = req.body.rating;
    partFields.number_of_uses = req.body.number_of_uses;


    TzPart.findOneAndUpdate({ _id: req.body.id }, { $set: partFields }, { new: true })
      .then((tz) => {
        res.json(tz);
      })
      .catch((err) => console.log(err));
  }
);

// @route POST api/tz_parts/delete
// @desc Delete an existing part
// @access Private
router.delete(
  "/delete/:id",
  //passport.authenticate("jwt", { session: false }),
  (req, res) => {
    TzPart.findById(req.params.id).then((part) => {
      part.remove().then(() => res.json({ success: true }));
    });
  }
);

module.exports = router;
