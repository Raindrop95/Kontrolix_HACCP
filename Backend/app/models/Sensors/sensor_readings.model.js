module.exports = (sequelize, Sequelize) => {
  const sensor_readings = sequelize.define("sensor_readings", {
    sensor_id: {
      type: Sequelize.INTEGER,
    },
    company_id: {
      type: Sequelize.INTEGER,
    },
    temperature: {
      type: Sequelize.DOUBLE,
    },
    humidity: { type: Sequelize.DOUBLE },
  });

  return sensor_readings;
};
