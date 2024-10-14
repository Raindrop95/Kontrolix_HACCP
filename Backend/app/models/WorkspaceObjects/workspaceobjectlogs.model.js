module.exports = (sequelize, Sequelize) => {
  const workspace_objects_logs = sequelize.define("workspace_objects_logs", {
    qr_code_id: {
      type: Sequelize.INTEGER,
    },
    user_id: {
      type: Sequelize.INTEGER,
    },
    cleaning_agents: {
      type: Sequelize.STRING,
    },
    condition_image: {
      type: Sequelize.STRING,
    },
    company_id: { type: Sequelize.INTEGER },
  });

  return workspace_objects_logs;
};
