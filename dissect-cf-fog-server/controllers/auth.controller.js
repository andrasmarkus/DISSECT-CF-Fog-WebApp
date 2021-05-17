const db = require("../models");
const config = require("../config/auth.config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = db.collection('users');

/**
 * It tries the sign up the new user. If it succeed it will send 201 response with a message,
 * if not itt will send 500 response with a message.
 * @param {Request} req - request
 * @param {Response} res - response
 */
const signUp = async (req, res) => {
  User.add({
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(() => {
      res.status(201).send({ message: "User was registered successfully!" });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

/**
 * It tries the sign in the user. If it succeed it will send 200 response with the user id, the email and token.
 * Response if something went wrong:
 * - 404 - email is not found
 * - 401 - invalid password
 * - 500 - other
 * @param {Request} req - request
 * @param {Response} res - response
 */
const signIn = (req, res) => {
  User.where('email', '==', req.body.email)
    .get()
    .then((users) => {

      if (users.empty) {
        return res.status(404).send({ message: "User Not found." });
      }

      const user = users.docs[0];

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.data().password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      const token = jwt.sign({ id: user.data().id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      res.status(200).send({
        id: user.data().id,
        email: user.data().email,
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