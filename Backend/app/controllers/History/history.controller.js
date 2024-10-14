const dateHandler = require("../Functions/dateHandler");
const db = require("../../models");

var bcrypt = require("bcryptjs");

const food_objects = db.food_objects;
const food_objects_history = db.food_objects_history;
const qr_codes = db.qr_codes;
const product_names = db.product_names;
const food_objects_logs = db.food_objects_logs;
const users = db.user;

exports.getAllHistoryFoodQrCodes = (req, res) => {
  food_objects_history
    .findAll({ where: { company_id: req.query.company_id } })
    .then((foundQrCodes) => {
      var foundCodes = foundQrCodes;
      const qrCodePromises = foundCodes.map((code, i) =>
        qr_codes
          .findAll({ where: { id: code.qr_code_id } })
          .then((itemQrCode) => {
            foundCodes[i].dataValues.qr_code_str = itemQrCode[0].qr_code_id;
          })
      );

      const productPromises = foundCodes.map((code, i) =>
        product_names
          .findAll({ where: { id: code.product_id } })
          .then((foundProduct) => {
            foundCodes[i].dataValues.product_name =
              foundProduct[0].product_name;
          })
      );

      return Promise.all([...qrCodePromises, ...productPromises]).then(() => {
        res.send(foundCodes);
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving the API Infos.",
      });
    });
};
