module.exports = (sequelize, Sequelize) => {
  const food_objects_history = sequelize.define(
    "Food_Objects_History",
    {
      qr_code_id: {
        type: Sequelize.INTEGER,
      },
      product_id: {
        type: Sequelize.INTEGER,
      },
      batch_number: {
        type: Sequelize.STRING,
      },
      quantity: {
        type: Sequelize.STRING,
      },
      delivery_temperature: {
        type: Sequelize.STRING,
      },
      store_temperature: {
        type: Sequelize.STRING,
      },
      opening_date: {
        type: Sequelize.DATE,
      },
      vaccuming_date: {
        type: Sequelize.DATE,
      },
      packed_on_date: {
        type: Sequelize.DATE,
      },

      freeze_date: {
        type: Sequelize.DATE,
      },
      thaw_date: { type: Sequelize.DATE },
      best_before_date: { type: Sequelize.DATE },
      delivery_note_image_path: { type: Sequelize.STRING },
      food_item_image_path: { type: Sequelize.STRING },
      company_id: { type: Sequelize.INTEGER },
    },
    { updatedAt: false }
  );

  return food_objects_history;
};
