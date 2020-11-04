const db = require("../models");

const User = db.user;

const checkSignUp = (req, res, next) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(user => {
    if (user) {
      console.log(user);
      res.status(400).send({
        message: "Failed! E-mail is already in use!"
      });
      return;
    }
    next();
  })
  .catch(err => {
      res.status(500).send({ message: err.message });
  });
}

module.exports = checkSignUp;