const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const wrapAsync = require("./utils/wrapAsync");
const dotenv = require("dotenv").config({ path: "config/config.env" });
const ExpressError = require("./utils/ExpressError");
const listingSchema = require("./schema");
const app = express();
const ejsMate = require("ejs-mate");

async function fun() {
  await mongoose.connect(
    `mongodb+srv://yadavsandhya371:${process.env.PASSWORD}@cluster0.pjcrzty.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
  );
  console.log("connected");
}

fun()
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);
const validateListing = (req, res, next) => {
  const result = listingSchema.validate(req.body);
  console.log(result);
  if (result.error) {
    throw new ExpressError(400, result.error);
  } else {
    next();
  }
};
app.get(
  "/listings/new",
  wrapAsync(async (req, res) => {
    res.render("listings/newListing.ejs");
  })
);

app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    res.render("listings/show.ejs", { listing });
  })
);

app.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);

app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    // console.log(id);
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);
app.put(
  "/listings/:id",
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
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    // console.log("Hi");
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);
app.get("/testListings", async (req, res) => {
  res.send("saved ");
});

app.get("/", (req, res) => {
  res.send("Hi");
});
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});
app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong" } = err;
  res.status(status).send(message);
});
app.listen(8000, () => {
  console.log("Server is working on port number 8000");
});

// mongoose.connect()
