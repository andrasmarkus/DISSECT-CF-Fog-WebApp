const db = require("../models");
const config = require("../config/auth.config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = db.user;

/**
 * It tries the sign up the new user. If it succeed it will send 201 response with a message,
 * if not itt will send 500 response with a message.
 * @param {Request} req - request
 * @param {Response} res - response
 */
const signUp = (req, res) => {
  User.create({
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
      res.status(201).send({ message: "User was registered successfully!" });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

/**
 * It tries the sign in the user. If it succeed it will send 200 response with the user id, the eamil and token.
 * Response if something went wrong:
 * - 404 - email is not found
 * - 401 - invalid password
 * - 500 - other
 * @param {Request} req - request
 * @param {Response} res - response
 */
const signIn = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      res.status(200).send({
        id: user.id,
        email: user.email,
        accessToken: token
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

const authentication = {
  signUp,
  signIn
};

module.exports = authentication;