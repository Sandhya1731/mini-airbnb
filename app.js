const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const wrapAsync = require("./utils/wrapAsync");
const dotenv = require("dotenv").config({ path: "config/config.env" });
const ExpressError = require("./utils/ExpressError");

const app = express();
const ejsMate = require("ejs-mate");
const listing = require("./routes/listing");
const review = require("./routes/review");

async function fun() {
  await mongoose.connect(
    `mongodb+srv://yadavsandhya371:${process.env.PASSWORD}@cluster0.pjcrzty.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
  );
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

app.use("/listings", listing);
app.use("/listings/:id/reviews", review);

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
