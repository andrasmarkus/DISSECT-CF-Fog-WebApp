
/**
 * It creates User schema with Sequelize library with the given configuration options.
 * @param sequelizeConfig
 * @param  Sequelize
 */
module.exports = (sequelizeConfig, sequelize) => {
  const User = sequelizeConfig.define("users", {
    email: {
      type: sequelize.STRING
    },
    password: {
      type: sequelize.STRING
    }
  });

  return User;
};