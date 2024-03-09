const mongoose = require('mongoose');
const listing = require('../models/listing');
const initData = require('./data')
const DB_URI = "mongodb://localhost:27017/newDB"

const fun = async () => {
    await mongoose.connect(DB_URI);
}

fun().then(()=>{
    console.log("Database connected");
}).catch((err)=>{
    console.log(err);
})

async function initialise(){
    await listing.deleteMany();
    await listing.insertMany(initData);
}


initialise();
