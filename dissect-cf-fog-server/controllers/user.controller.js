const mongodb = require('../services/mongodb-service');

/**
 * Sends all the users from the database with the given response.
 * If comes some error, 500 will be thrown with a message property.
 * @param {Request} req - request
 * @param {Response} res - response
 */
const getAllUser = async (req, res) => {

  try {
    const users = await mongodb.getAllUsers();
    res.status(200).send({users: users})
  } catch (e) {
    res.status(500).send({message: e.message});
  }
};

const userControls = {
  getAllUser,
};

module.exports = userControls;