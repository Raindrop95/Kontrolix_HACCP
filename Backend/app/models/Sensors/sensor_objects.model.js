module.exports = (sequelize, Sequelize) => {
  const sensor_objects = sequelize.define("sensor_objects", {
    sensor_id: {
      type: Sequelize.INTEGER,
    },
    company_id: {
      type: Sequelize.INTEGER,
    },
    mac_address: {
      type: Sequelize.STRING,
    },
    is_activated: { type: Sequelize.BOOLEAN },
    is_active: { type: Sequelize.BOOLEAN },
  });

  return sensor_objects;
};
