const express= require("express");
const router = express.Router();
const {registerUser, loginUser} = require("../controllers/authController");

router.post("/register", registerUser);
// router.post("/register", (req,res)=>{
//     console.log("Register routs hit");
//     res.send("working");
// });
router.post("/login", loginUser);

module.exports = router;