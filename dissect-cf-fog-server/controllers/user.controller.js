const db = require("../models");

const User = db.user;

/**
 * Sends all the users from the database with the given response.
 * If comes some error, 500 will be thrown with a message property.
 * @param {Request} req - request
 * @param {Response} res - response
 */
const getAllUser = (req, res) => {
  User. User.findAll()
    .then(users => {
      res.status(200).send({ users: users });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

const userControls = {
  getAllUser,
};

module.exports = userControls;