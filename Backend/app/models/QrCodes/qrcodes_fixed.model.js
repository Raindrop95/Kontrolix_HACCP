module.exports = (sequelize, Sequelize) => {
  const qr_codes_fixed = sequelize.define("qr_codes_fixed", {
    qr_code_id: {
      type: Sequelize.STRING,
    },
    registered_company_id: {
      type: Sequelize.INTEGER,
    },
    is_active: {
      type: Sequelize.BOOLEAN,
    },
  });

  return qr_codes_fixed;
};
