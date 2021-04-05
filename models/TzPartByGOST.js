const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const TzPartByGOSTSchema = new Schema({
  gost: {
    type: Schema.Types.ObjectId,
    ref: "gosts",
    required: true,
  },
  name: {
    type: String,
  },
  number: {
    type: "Number",
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = TzPartByGOST = mongoose.model(
  "tzpartsbygost",
  TzPartByGOSTSchema
);
