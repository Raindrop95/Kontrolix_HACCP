module.exports = (sequelize, Sequelize) => {
  const workspace_objects_histories = sequelize.define(
    "workspace_objects_histories",
    {
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
    }
  );

  return workspace_objects_histories;
};
