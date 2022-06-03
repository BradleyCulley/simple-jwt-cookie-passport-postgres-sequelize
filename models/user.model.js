module.exports = (sequelize, Sequelize) => {
  return sequelize.define("user", {
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    }
  });
};
