const router = require("express").Router();
const Movie = require("../models/Movie");
const verify = require("../verifyToken");

//CREATE NEW MOVIE
router.post("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    const newMovie = new Movie(req.body);
    try {
        const savedMovie = await newMovie.save();
        res.status(201).json(savedMovie)
    } catch (err) {
      res.status(404).json(err);
    }
  } else {
    res.status(403).json("You are not allowed!");
  }
});
//Update
router.put("/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
        const updatedMovie = await Movie.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true});
        res.status(200).json(updatedMovie)
    } catch (err) {
      res.status(404).json(err);
    }
  } else {
    res.status(403).json("You are not allowed!");
  }
});

//Delete
router.delete("/:id", verify, async (req, res) => {
    if (req.user.isAdmin) {
      try {
          await Movie.findByIdAndDelete(req.params.id);
          res.status(200).json("The Movie has been deleted")
      } catch (err) {
        res.status(404).json(err);
      }
    } else {
      res.status(403).json("You are not allowed!");
    }
  });

  //Get
router.get("/find/:id", verify, async (req, res) => {
      try {
          const movie = await Movie.findById(req.params.id);
          res.status(200).json(movie)
      } catch (err) {
        res.status(400).json(err);
      }
    } 
  );

    //GetRandomMovie
router.get("/random", verify, async (req, res) => {
    const type = req.query.type;
    let movie;
    try {
        if(type==="series"){
            movie=await Movie.aggregate([{$match:{isSeries:true}},{$sample:{size:1}}])//match find all series - sample give us one 
        }
        if(type==="movie"){
            movie=await Movie.aggregate([{$match:{isSeries:false}},{$sample:{size:1}}])//match find all movies - sample give us one 
        }
        if(type!="series"&&type!="movie"){
          movie=await Movie.aggregate([{$sample:{size:1}}])//match find all movies - sample give us one 
        }
        res.status(200).json(movie)
    } catch (err) {
      res.status(400).json(err);
    }
  } 
);
//GET ALL
router.get("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
        const movies = await Movie.find({});
        res.status(200).json(movies.reverse())
    } catch (err) {
      res.status(404).json(err);
    }
  } else {
    res.status(403).json("You are not allowed!");
  }
});
router.get("/countmovies", verify, async (req, res) => {
  //localhost:8800/api/movies/countmovies
  if (req.user.isAdmin) {
    try {
    const countmovies = await Movie.countDocuments({})
      res.status(200).json({countmovies:countmovies});
    } catch (err) {
      res.status(400).json(err);
    }
  } else {
    res.status(403).json("You are not allowed to count all movies!");
  }
});
module.exports = router;
