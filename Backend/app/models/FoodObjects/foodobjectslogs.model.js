module.exports = (sequelize, Sequelize) => {
  const food_objects_logs = sequelize.define(
    "food_objects_logs",
    {
      qr_code_id: {
        type: Sequelize.INTEGER,
      },
      employee_id: {
        type: Sequelize.INTEGER,
      },
      action_id: {
        type: Sequelize.INTEGER,
      },
      measured_temperature: {
        type: Sequelize.INTEGER,
      },
      reported_quantity: {
        type: Sequelize.STRING,
      },
      throw_away_reason: {
        type: Sequelize.STRING,
      },
      throw_away_image_path: {
        type: Sequelize.STRING,
      },
      company_id: { type: Sequelize.INTEGER },
    },
    { updatedAt: false }
  );

  return food_objects_logs;
};
