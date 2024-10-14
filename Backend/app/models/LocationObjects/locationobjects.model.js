module.exports = (sequelize, Sequelize) => {
  const location_objects = sequelize.define("location_objects", {
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
  });

  return location_objects;
};
