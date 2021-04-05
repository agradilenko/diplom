const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const TzSchema = new Schema({

  owner: {
    type: Object,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  gost: {
    type: Schema.Types.ObjectId,
    ref: "gosts",
    // required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  tags: [{ type: "ObjectId", ref: "tags", required: false }],
});

module.exports = Tz = mongoose.model("tzs", TzSchema);
