const config = require("../config/auth.config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongodb = require('../services/mongodb-service');

/**
 * It tries the sign up the new user. If it succeed it will send 201 response with a message,
 * if not itt will send 500 response with a message.
 * @param {Request} req - request
 * @param {Response} res - response
 */
const signUp = async (req, res) => {
    try {
        const user = await mongodb.addUser({email: req.body.email, password: bcrypt.hashSync(req.body.password, 8)});
        console.log((user.insertedId));
        res.status(201).send({message: "User was registered successfully"});
    } catch (e) {
        res.status(500).send({message: "Error"});
    }
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
const signIn = async (req, res) => {
    try {
        let user = await mongodb.getUser({
            email: req.body.email
        })

        console.log(user);

        if (user == null) {
            return res.status(404).send({message: "User Not found."});
        } else {
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

            const token = jwt.sign({id: user._id}, config.secret, {
                expiresIn: 86400 // 24 hours
            });

            res.status(200).send({
                id: user._id,
                email: user.email,
                accessToken: token
            });
        }
    } catch (e) {
        res.status(500).send({message: "Error"});
    }
};

const authentication = {
    signUp,
    signIn
};

module.exports = authentication;