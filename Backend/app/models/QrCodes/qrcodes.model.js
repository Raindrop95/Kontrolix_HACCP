module.exports = (sequelize, Sequelize) => {
  const qr_codes = sequelize.define("qr_codes", {
    qr_code_id: {
      type: Sequelize.STRING,
    },
    category_id: {
      type: Sequelize.INTEGER,
    },
    registered_company_id: {
      type: Sequelize.INTEGER,
    },
    is_active: {
      type: Sequelize.BOOLEAN,
    },
    is_fixed: {
      type: Sequelize.BOOLEAN,
    },
    is_removed: {
      type: Sequelize.BOOLEAN,
    },
  });

  return qr_codes;
};
