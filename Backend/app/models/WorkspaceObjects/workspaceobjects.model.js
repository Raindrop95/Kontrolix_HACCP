module.exports = (sequelize, Sequelize) => {
  const workspace_objects = sequelize.define("workspace_objects", {
    qr_code_id: {
      type: Sequelize.INTEGER,
    },
    workspace_name: {
      type: Sequelize.STRING,
    },
    preferred_cleaning_agent: {
      type: Sequelize.STRING,
    },
    preferred_condition_image: {
      type: Sequelize.STRING,
    },
    company_id: { type: Sequelize.INTEGER },
  });

  return workspace_objects;
};
