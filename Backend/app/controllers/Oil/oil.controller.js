const db = require("../../models");
const Op = db.Sequelize.Op;

const oil_objects = db.oilchange_objects;
const users = db.user;

exports.getAllOilChanges = (req, res) => {
  const company_id = req.query.company_id;

  //   oil_objects
  //     .findAll({ where: { company_id: company_id } })
  //     .then((oil_objs) => {
  //       res.send(oil_objs);
  //     });

  oil_objects
    .findAll({ where: { company_id: company_id } })
    .then((oil_objs) => {
      const promises = [];
      for (let i = 0; i < oil_objs.length; i++) {
        promises.push(
          users
            .findAll({ where: { id: oil_objs[i].employee_id } })
            .then((foundUser) => {
              oil_objs[i].dataValues.employee_name =
                foundUser[0].name + " " + foundUser[0].surname;
            })
        );
      }
      // Wait for all promises to resolve
      return Promise.all(promises).then(() => oil_objs);
    })
    .then((oil_objs_withNames) => {
      // Now all promises have resolved, send the response
      res.send(oil_objs_withNames);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving the API Infos.",
      });
    });
};

exports.addNewOilChange = (req, res) => {
  const company_id = req.query.company_id;
  const container_name = req.query.container_name;
  const oil_type = req.query.oil_type;
  const ph_value = req.query.ph_value;
  const quantity = req.query.quantity;
  const employee_id = req.query.employee_id;

  oil_objects.create({
    container_name: container_name,
    oil_type: oil_type,
    quantity: quantity,
    ph_value: ph_value,
    company_id: company_id,
    employee_id: employee_id,
  });

  res.send(true);
};

exports.editOilChange = (req, res) => {
  const company_id = req.query.company_id;
  const oilchange_id = req.query.oilchange_id;
  const container_name = req.query.container_name;
  const oil_type = req.query.oil_type;
  const ph_value = req.query.ph_value;
  const quantity = req.query.quantity;

  oil_objects.update(
    {
      container_name: container_name,
      oil_type: oil_type,
      quantity: quantity,
      ph_value: ph_value,
      company_id: company_id,
    },
    { where: { id: oilchange_id, company_id: company_id } }
  );

  res.send(true);
};

exports.deleteOilChange = (req, res) => {
  const company_id = req.query.company_id;
  const oilchange_id = req.query.oilchange_id;

  oil_objects.destroy({ where: { id: oilchange_id, company_id: company_id } });

  res.send(true);
};
