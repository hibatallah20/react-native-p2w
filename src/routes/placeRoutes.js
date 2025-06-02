import express from "express"
import Place from "../models/Place.js";


const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { title, details, description, image, rating, location } = req.body;

    if (!title || !description || !image || !rating) {
      return res.status(400).json({ message: "Required fields are missing." });
    }
    // save to database
    const newPlace = new Place({
      title,
      details,
      description,
      image,
      rating,
      location,
    });

    await newPlace.save();

    res.status(201).json(newPlace);

  } catch (error) {
    console.log("Error creating place:", error);
    res.status(500).json({ message: error.message});
  }
});

//get all places
//pagination => infinite loading
router.get("/", async (req, res) => {
    try{
        const page = req.query.page || 1;
        const limit = req.query.limit || 5;
        const skip = (page - 1) * limit;

        const places = await Place.find()
         .sort({ createdAt: -1}) //desc
         .skip(skip)
         .limit(limit)
         const totalPlaces = await Place.countDocuments();

        res.send({
            places,
            currentPage: page,
            totalPlaces,
            totalPages: Math.ceil(totalPlaces / limit),
        });
    } catch (error) {
        console.log("Error in get all places route", error);
        res.status(500).json({ message: "Internal server error" });

    }
})

router.delete("/:id", async (req, res) => {
    try { 
        const place = await Place.findById(req.params.id);
        if (!place) return res.status(404).json({ message: "Place not found" });

        await place.deleteOne();

       res.json({ message: "Place deleted successfully" });
    } catch (error) {
     console.log("Error deleting place", error);
     res.status(500).json({ message: "Internal server error" });
    }
});

export default router;