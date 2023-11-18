const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const verify = require("../verifyToken")
//Registar -
/*    "username":"liroy",
    "email":"lama@gmail.com",
    "password":"123456"*/
router.post("/registar", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SECRET_KEY
    ).toString()
  });
  try {
    const user = await newUser.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json(err);
  }
});
//Login
/* 
    "email":"lama@gmail.com",
    "password":"123456"*/
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(404).json("Wrong password or EMAIL");
      return;
    }
    const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
    const originalPassword = bytes.toString(CryptoJS.enc.Utf8);
    if(originalPassword !== req.body.password){
      res.status(404).json("Wrong password or EMAIL");
      return
    }
      const accessToken = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.SECRET_KEY,
        { expiresIn: "30d" }
      );
      const { password, ...info } = user._doc;
      res.status(200).json({ ...info, accessToken });
  } catch (err) {
    res.status(400).json(err.toString());
  }
});
module.exports = router;
/*router.post("/registar", async (req, res) => {
    //req.body - מה שנשלח מהצד לקוח
    let validBody = validUser(req.body);
    if (validBody.error) {
      return res.status(400).json(validBody.error.details);
    }
    try {
      let userEmailCheack = await UserModel.findOne({email:req.body.email})
      if(userEmailCheack){
        return(res.status(400).json({message: "Email Already in System"}))
      }
      let user = new UserModel(req.body);
      user.pass = await bcrypt.hash(user.pass, 10);
      await user.save();//שומר בדאטה בייס
      user.pass = "*******";
      let newToken = genToken(user._id)//מייצר תוקן לפי מה שאני מכניס EMAIL/ID
      console.log(newToken)
      res.json({userinfo:user,token:newToken,expiresIn:3600});
    } 
    catch (err) {
      console.log(err);
      return res.status(400).json({message: "Email Already in System or there another problem" });
      }
  });*/
