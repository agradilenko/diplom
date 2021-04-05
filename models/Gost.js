const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const GostSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

module.exports = Gost = mongoose.model("gosts", GostSchema);
