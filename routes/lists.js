const router = require("express").Router();
const List = require("../models/List");
const verify = require("../verifyToken");

//CREATE NEW List
router.post("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    const newList = new List(req.body);
    try {
      const savedList = await newList.save();
      res.status(201).json(savedList);
    } catch (err) {
      res.status(404).json(err);
    }
  } else {
    res.status(403).json("You are not allowed!");
  }
});
//UPDATE
router.put("/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
        const updatedList = await List.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true});
        res.status(200).json(updatedList)
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You are not allowed!");
  }
});
//DELETE
router.delete("/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      await List.findByIdAndDelete(req.params.id);
      res.status(201).json("The list has been deleted...");
    } catch (err) {
      res.status(404).json(err);
    }
  } else {
    res.status(403).json("You are not allowed!");
  }
});
//GET
router.get("/", verify, async (req, res) => {
  const typeQuery = req.query.type;
  const genreQuery = req.query.genre;
  let list = [];
  try {
    if (typeQuery) {
      if (genreQuery) {
        list = await List.aggregate([
          {
            $sample: { size: 10 },
          },
          { $match: { type: typeQuery, genre: genreQuery } },//localhost:8800/api/lists?type=series&genre=crime
        ]);
      }else{
        list = await List.aggregate([
          {
            $sample: { size: 10 },
          },
          { $match: { type: typeQuery} },//localhost:8800/api/lists?type=movie
        ])
      }
    } else {
      list = await List.aggregate([{ $sample: { size: 10 } }]);//localhost:8800/api/lists
    }
    res.status(200).json(list);
  } catch (err) {
    res.status(400).json(err);
  }
});
module.exports = router;
