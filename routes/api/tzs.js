const express = require("express");
const router = express.Router();
const passport = require("passport");

const Tz = require("../../models/Tz");

// @route GET api/tzs
// @desc Get all tzs for a specific user
// @access Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    let tzsArr = [];

    const OWNER = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    };

    await Tz.find({ owner: OWNER })
      .then((tzs) => {
        let finalArr = [...tzs, ...tzsArr];
        res.json(finalArr);
      })
      .catch((err) => console.log(err));
  }
);

// @route GET api/tzs/:id
// @desc Get specific tz by id
// @access Private
router.get(
  "/:id",
  // passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let id = req.params.id;

    Tz.findById(id).then((tz) => res.json(tz));
  }
);

// @route POST api/tzs/create
// @desc Create a new tz
// @access Private
router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const OWNER = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    };

    const NEW_TZ = await new Tz({
      owner: OWNER,
      name: req.body.name,
      description: req.body.description,
      gost: req.body.gost,
      tags: req.body.tags,
    });

    NEW_TZ.save().then((tz) => res.json(tz));
  }
);

// @route PATCH api/tzs/update
// @desc Update an existing tz
// @access Private
router.patch(
  "/update",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let tzFields = {};

    tzFields.name = req.body.name;
    tzFields.description = req.body.description;
    tzFields.gost = req.body.gost;
    tzFields.tags = req.body.tags;

    Tz.findOneAndUpdate({ _id: req.body.id }, { $set: tzFields }, { new: true })
      .then((tz) => {
        res.json(tz);
      })
      .catch((err) => console.log(err));
  }
);

// @route DELETE api/tzs/delete/:id
// @desc Delete an existing tz
// @access Private
router.delete(
  "/delete/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Tz.findById(req.params.id).then((tz) => {
      tz.remove().then(() => res.json({ success: true }));
    });
  }
);

module.exports = router;
