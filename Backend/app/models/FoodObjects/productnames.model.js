module.exports = (sequelize, Sequelize) => {
  const product_names = sequelize.define(
    "Product_Names",
    {
      product_name: {
        type: Sequelize.STRING,
      },
      company_id: { type: Sequelize.INTEGER },
    },
    { updatedAt: false, createdAt: false }
  );

  return product_names;
};
