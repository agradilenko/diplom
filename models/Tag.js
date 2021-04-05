const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const TagSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

module.exports = Tag = mongoose.model("tags", TagSchema);
