const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews");
const listingSchema = new Schema({
  title: String,
  description: String,
  image: {
    type: String,
    default:
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Ffree-photos-vectors%2Fbackground&psig=AOvVaw0n8e-JMyyG4LJUNVO4Kg6z&ust=1708690792873000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCPjsx7f3voQDFQAAAAAdAAAAABAF",
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectID,
      ref: "Review",
    },
  ],
});

listingSchema.post("findOneAndDelete", async (listing) => {
  await Review.deleteMany({ _id: { $in: listing.reviews } });
});
const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
