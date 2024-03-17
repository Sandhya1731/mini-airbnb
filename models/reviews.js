const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  comment: String,
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  createdOn: {
    type: Date,
    default: Date.now(),
  },
});
module.exports = mongoose.model("Review", reviewSchema);
