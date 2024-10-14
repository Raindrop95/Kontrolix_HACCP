const dateHandler = require("../Functions/dateHandler");
const db = require("../../models");
var bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const imageHandler = require("../Functions/ftpImageHandler.js");

const food_objects = db.food_objects;
const food_objects_history = db.food_objects_history;
const qr_codes = db.qr_codes;
const product_names = db.product_names;
const food_objects_logs = db.food_objects_logs;
const users = db.user;

// GET for QR-Code Statistics: used, unused, active
exports.getQrCodeStatistic = async (req, res) => {
  var unusedQrCodes = 0;
  var activeQrCodes = 0;
  var activeFoodCodes = 0;
  var activeWorkspaceCodes = 0;
  var activeLocationCodes = 0;

  var usedUpProducts = 0;
  var thrownawayProducts = 0;

  await qr_codes
    .findAll({
      where: {
        is_active: false,
        is_removed: false,
        registered_company_id: req.query.company_id,
      },
    })
    .then((unusedCodes) => {
      unusedQrCodes = unusedCodes.length;
    });
  await qr_codes
    .findAll({
      where: {
        is_active: true,
        is_removed: false,
        registered_company_id: req.query.company_id,
      },
    })
    .then((activeCodes) => {
      activeQrCodes = activeCodes.length;
    });

  await qr_codes
    .findAll({
      where: {
        is_active: true,
        is_removed: false,
        category_id: 1,
        registered_company_id: req.query.company_id,
      },
    })
    .then((FoodCodes) => {
      activeFoodCodes = FoodCodes.length;
    });
  await qr_codes
    .findAll({
      where: {
        is_active: true,
        is_removed: false,
        category_id: 2,
        registered_company_id: req.query.company_id,
      },
    })
    .then((WorkspaceCodes) => {
      activeWorkspaceCodes = WorkspaceCodes.length;
    });
  await qr_codes
    .findAll({
      where: {
        is_active: true,
        is_removed: false,
        category_id: 3,
        registered_company_id: req.query.company_id,
      },
    })
    .then((LocationCodes) => {
      activeLocationCodes = LocationCodes.length;
    });

  await food_objects_logs
    .findAll({ where: { action_id: 8, company_id: req.query.company_id } })
    .then((thrownaway) => {
      thrownawayProducts = thrownaway.length;
    });

  await food_objects_logs
    .findAll({ where: { action_id: 3 } })
    .then((usedUp) => {
      usedUpProducts = usedUp.length;
    });

  var qrData = { unused: 0, active: 0 };
  qrData.unused = unusedQrCodes;
  qrData.active = activeQrCodes;
  qrData.activeFoodCodes = activeFoodCodes;
  qrData.activeWorkspaceCodes = activeWorkspaceCodes;
  qrData.activeLocationCodes = activeLocationCodes;
  qrData.thrownawayProducts = thrownawayProducts;
  qrData.usedUpProducts = usedUpProducts;

  res.send(qrData);
};

// GET for all active QR-Codes. Returns all data of QR-Code
exports.getAllActiveQrCodes = (req, res) => {
  food_objects
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
            if (code.product_id != 0) {
              foundCodes[i].dataValues.product_name =
                foundProduct[0].product_name;
            }
          })
      );

      return Promise.all([...qrCodePromises, ...productPromises]).then(() => {
        res.send(foundCodes);
      });
    });
};

exports.getQrCodeInfo = (req, res) => {
  const read_qr_code = req.query.qr_code;
  console.log(req.query.qr_code);
  qr_codes
    .findAll({ where: { qr_code_id: read_qr_code } })
    .then((foundQrCodes) => {
      if (foundQrCodes.length == 0) {
        console.log("ERROR1");
        res.send("ERROR01");
      } else {
        if (foundQrCodes[0].is_removed == true) {
          console.log("ERROR2");
          res.send("ERROR01");
        } else {
          if (
            foundQrCodes[0].is_active == false &&
            foundQrCodes[0].is_removed == false
          ) {
            res.send([foundQrCodes[0], 0]);
          } else {
            if (foundQrCodes[0].category_id == 1) {
              food_objects
                .findAll({ where: { qr_code_id: foundQrCodes[0].id } })
                .then((foundFoodObject) => {
                  if (foundFoodObject.length == 0) {
                    res.send("ERROR02");
                  } else {
                    product_names
                      .findAll({
                        where: { id: foundFoodObject[0].product_id },
                      })
                      .then((foundProductName) => {
                        foundFoodObject[0].dataValues.product_name =
                          foundProductName[0].product_name;
                        res.send([foundFoodObject, 1]);
                      })
                      .catch((err) => {
                        res.status(500).send({
                          message: err.message || "Couldn't get Food Item.",
                        });
                      });
                  }
                })
                .catch((err) => {
                  res.status(500).send({
                    message: err.message || "Couldn't get Food Item.",
                  });
                });
            } else if (foundQrCodes[0].category_id == 2) {
              db.workspace_objects
                .findAll({ where: { qr_code_id: foundQrCodes[0].id } })
                .then(async (foundWorkspace) => {
                  const imagePath = foundWorkspace[0].preferred_condition_image;

                  const base64Image = await imageHandler.displayImageAsBase64(
                    imagePath
                  );

                  res.send([foundWorkspace, 2, base64Image]);
                });
            } else if (foundQrCodes[0].category_id == 3) {
              db.location_objects
                .findAll({ where: {qr_code_id: foundQrCodes[0].id} })
                .then(async (foundLocation) => {
                  const imagePath = foundLocation[0].preferred_condition_image

                  const base64Image = await imageHandler.displayImageAsBase64(
                    imagePath
                  );

                  res.send([foundLocation,3,base64Image])
                })
            }
          }
        }
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occured while retrieving the API Infos.",
      });
    });
};
 