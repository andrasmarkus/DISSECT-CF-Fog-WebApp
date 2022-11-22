const {MongoClient} = require("mongodb");
const mongodb = require('../services/mongodb-service');

/**
 * Checks the user email exists in database. If it is, it will forward the request.
 * Responses:
 * - 400 - email already used!
 * - 500 - other
 * @param {Request} req - request
 * @param {Response} res - response
 * @param {Function} next - forwards it
 */
const checkSignUp = async (req, res, next) => {
    try {
        const user = await mongodb.getUser({ email: req.body.email })

        console.log('check:' + JSON.stringify(user));

        if (user != null) {
            res.status(400).send({ message: "Failed! E-mail is already in use!" });
        } else {
            next();
        }
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
}

module.exports = checkSignUp;


