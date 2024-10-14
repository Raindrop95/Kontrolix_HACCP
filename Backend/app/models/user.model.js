module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    company_id: {
      type: Sequelize.INTEGER,
    },
    username: {
      type: Sequelize.STRING,
    },
    name: {
      type: Sequelize.STRING,
    },
    surname: {
      type: Sequelize.STRING,
    },
    role: {
      type: Sequelize.STRING,
    },

    email: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    user_image_path: {
      type: Sequelize.STRING,
    },
    preferred_language: {
      type: Sequelize.STRING,
    },
    isActive: {
      type: Sequelize.BOOLEAN,
    },
  });

  return User;
};
