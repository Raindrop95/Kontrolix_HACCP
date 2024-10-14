module.exports = (sequelize, Sequelize) => {
  const cleaning_agents = sequelize.define("cleaning_agents", {
    agent_name: {
      type: Sequelize.STRING,
    },
    agent_details_photo_path: {
      type: Sequelize.STRING,
    },
    isDeleted: {
      type: Sequelize.BOOLEAN,
    },
    company_id: { type: Sequelize.INTEGER },
  });

  return cleaning_agents;
};
