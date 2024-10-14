module.exports = (sequelize, Sequelize) => {
  const oilchange_objects = sequelize.define("oilchange_objects", {
    container_name: {
      type: Sequelize.STRING,
    },
    oil_type: {
      type: Sequelize.STRING,
    },
    quantity: {
      type: Sequelize.STRING,
    },
    ph_value: {
      type: Sequelize.STRING,
    },
    company_id: { type: Sequelize.INTEGER },
    employee_id: { type: Sequelize.INTEGER },
  });

  return oilchange_objects;
};
