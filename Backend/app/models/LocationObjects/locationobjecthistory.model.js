module.exports = (sequelize, Sequelize) => {
  const location_objects_histories = sequelize.define(
    "location_objects_histories",
    {
      qr_code_id: {
        type: Sequelize.INTEGER,
      },
      location_name: {
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

  return location_objects_histories;
};
