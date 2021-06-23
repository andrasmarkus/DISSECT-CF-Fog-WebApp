const db = require("../models/firestore");

/**
 * Checks the user email exists in database. If it is, it will forward the request.
 * Responses:
 * - 400 - email already used!
 * - 500 - other
 * @param {Request} req - request
 * @param {Response} res - response
 * @param {Function} next - forwards it
 */
const checkSignUp = (req, res, next) => {
  db.user.where('email', '==', req.body.email)
    .get()
    .then((user) => {
      if (!user.empty) {
        res.status(400).send({
          message: "Failed! E-mail is already in use!"
        });
        return;
      }
      next();
    })
}

module.exports = checkSignUp;