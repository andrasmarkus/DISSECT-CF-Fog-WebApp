const express = require('express');
const controller = require("../../controllers/auth-controller");
const router = express.Router({caseSensitive:true});

/* Sets the response header. */
router.use((req, res, next)=>{
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.post("/signup", controller.signUp);

router.post("/signin", controller.signIn);

module.exports = router;