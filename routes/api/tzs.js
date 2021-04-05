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
      tags: req.body.tags
    });

    NEW_TZ.save().then((tz) => res.json(tz));
  }
);

module.exports = router;
