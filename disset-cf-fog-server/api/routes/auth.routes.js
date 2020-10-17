const checkSignUp = require("../../middleware").checkSignUp;
const controller = require("../../controllers/auth.controller");
const express = require('express');
const router = express.Router({caseSensitive:true});


router.use((req, res, next)=>{
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.post("/signup", [checkSignUp], controller.signUp);

router.post("/signin", controller.signIn);

module.exports = router;
