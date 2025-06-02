import mongoose from "mongoose";

const placeSchema = new mongoose.Schema({
     title: {
        type: String,
        required: true,
     },
     details: {
       type: [String], 
       default: [],
     },
     description: {
        type: String,
        required: true,
     },
     image: {
        type: String,
        required: true,
     },
     rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
     },
     location: {
        address: String,
        latitude: Number,
        longitude: Number,
     },
}, { timestamps: true });

const Place = mongoose.model("Place", placeSchema);

export default Place;