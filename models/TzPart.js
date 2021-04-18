const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const TzPartSchema = new Schema({
  tz: {
    type: Schema.Types.ObjectId,
    ref: "tzs",
    required: true,
  },
  tz_by_gost: {
    type: Schema.Types.ObjectId,
    ref: "tzpartsbygost",
    required: true,
  },
  content: {
    type: Object,
    required: true,
  },
  rating: {
    type: Number,
  },
  number_of_uses: {
    type: Number,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = TzPart = mongoose.model("tzparts", TzPartSchema);
