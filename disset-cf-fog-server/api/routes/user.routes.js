const authJwt = require("../../middleware").authJwt;
const controller = require("../../controllers/user.controller");
const express = require('express');
const router = express.Router({caseSensitive:true});

router.use((req, res, next)=>{
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.get("/", [authJwt.verifyToken], controller.getAllUser);

module.exports = router;

