const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const verify = require("../verifyToken");
//UPDATE
router.put("/:id", verify, async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.SECRET_KEY
      ).toString();
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      req.status(500).json(err);
    }
  } else {
    res.status(403).json("You can update only your account");
  }
});
//DELETE
router.delete("/:id", verify, async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("user has been delete...");
    } catch (err) {
      req.status(500).json(err);
    }
  } else {
    res.status(403).json("You can Delete only your account");
  }
});

//GET
router.get("/find/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...info } = user._doc;
    res.status(200).json(info);
  } catch (err) {
    req.status(500).json(err);
  }
});
//GET ALL
router.get("/", verify, async (req, res) => {
  //localhost:8800/api/users/
  const query = req.query.new;
  if (req.user.isAdmin) {
    try {
      const users = query
        ? await User.find().sort({ _id: -1 }).limit(5)
        : await User.find(); //localhost:8800/api/users/?new=true (show only 4 and the last because of sort)
      res.status(200).json(users);
    } catch (err) {
      req.status(500).json(err);
    }
  } else {
    res.status(403).json("You are not allowed to see all users!");
  }
});
//GET USER STATS
router.get("/stats", async (req, res) => {
  const today = new Date();
  const lastYear = today.setFullYear(today.setFullYear() - 1);
  try{
const data = await User.aggregate([
  {
    $project: {
      month: { $month: "$createdAt" },
    },
  },
  {
    $group: {
      _id: "$month",
      total: { $sum: 1 },
    },
  },
]);
res.status(200).json(data)//months(_id) and count(total)
  }
  catch(err){
  res.status(500).json(err);
}
});
module.exports = router;
