const User = db.user;

const getAllUser = (req, res) => {
  User. User.findAll()
    .then(users => {
      res.send({ users: users });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

const userControls = {
  getAllUser,
};

module.exports = userControls;