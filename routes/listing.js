const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { listingSchema } = require("../schema");

const validateListing = (req, res, next) => {
  const result = listingSchema.validate(req.body);
  console.log(result);
  if (result.error) {
    throw new ExpressError(400, result.error);
  } else {
    next();
  }
};
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);
router.get(
  "/new",
  wrapAsync(async (req, res) => {
    res.render("listings/newListing.ejs");
  })
);

router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id).populate("reviews");
    res.render("listings/show.ejs", { listing });
  })
);

router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);

router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    // console.log(id);
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);
router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    const listing = req.body.listing;
    const { id } = req.params;
    console.log(id);
    console.log(listing);
    await Listing.findByIdAndUpdate(id, listing);
    res.redirect(`/listings/${id}`);
  })
);
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    // console.log("Hi");
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

module.exports = router;
