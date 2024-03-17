const express = require("express");
const router = express.Router({ mergeParams: true });
const { reviewSchema } = require("../schema");
const Review = require("../models/reviews");
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");

const validateReview = (req, res, next) => {
  const result = reviewSchema.validate(req.body);
  console.log(result);
  if (result.error) {
    throw new ExpressError(400, result.error);
  } else {
    next();
  }
};

//review
router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    const newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    console.log("saved");

    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${id}`);
  })
);

//delete
router.delete("/:reviewId", async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
});

module.exports = router;
