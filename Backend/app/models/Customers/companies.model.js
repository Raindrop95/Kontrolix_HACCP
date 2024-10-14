module.exports = (sequelize, Sequelize) => {
  const company_objects = sequelize.define("company_objects", {
    company_name: {
      type: Sequelize.STRING,
    },
    company_address: {
      type: Sequelize.STRING,
    },
    company_postcode: {
      type: Sequelize.STRING,
    },
    company_city: {
      type: Sequelize.STRING,
    },
    company_country: {
      type: Sequelize.STRING,
    },
    company_phonenumber: {
      type: Sequelize.STRING,
    },
    company_email: {
      type: Sequelize.STRING,
    },
    company_contact_person: {
      type: Sequelize.STRING,
    },
    company_customer_id_str: {
      type: Sequelize.STRING,
    },
  });

  return company_objects;
};
