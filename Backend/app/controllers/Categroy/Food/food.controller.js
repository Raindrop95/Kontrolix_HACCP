const dateHandler = require("../../Functions/dateHandler");
const db = require("../../../models");
const imageHandler = require("../../Functions/ftpImageHandler.js");
var bcrypt = require("bcryptjs");
const multer = require("multer");
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
}).single("image");
const fs = require("fs");
const path = require("path");
const { type } = require("os");
const food_objects = db.food_objects;
const food_objects_history = db.food_objects_history;
const qr_codes = db.qr_codes;
const product_names = db.product_names;
const food_objects_logs = db.food_objects_logs;
const users = db.user;

exports.getThrowAwayLog = async (req, res) => {
  const log_id = req.query.id;

  try {
    food_objects_logs.findAll({ where: { id: log_id } }).then(async (log) => {
      const image = await imageHandler.displayImageAsBase64(
        log[0].throw_away_image_path
      );

      res.send([image, log[0].throw_away_reason]);
    });
  } catch (err) {
    res.send(err);
  }
};

exports.throwFoodItemAway = async (req, res) => {
  const uniqueFilePath = await imageHandler.saveImage(req.body.foodImage);

  food_objects
    .findAll({ where: { qr_code_id: req.body.qr_code_id } })
    .then((foundFoodObject) => {
      food_objects_logs.create({
        qr_code_id: req.body.qr_code_id,
        employee_id: req.body.user_id,
        action_id: "8",
        reported_quantity: foundFoodObject[0].quantity,
        throw_away_reason: req.body.reason,
        company_id: req.body.company_id,
        throw_away_image_path: uniqueFilePath,
      });
      food_objects_history.create({
        qr_code_id: foundFoodObject[0].qr_code_id,
        product_id: foundFoodObject[0].product_id,
        batch_number: foundFoodObject[0].batch_number,
        quantity: foundFoodObject[0].quantity,
        delivery_temperature: foundFoodObject[0].delivery_temperature,
        store_temperature: foundFoodObject[0].store_temperature,
        opening_date: foundFoodObject[0].opening_date,
        vaccuming_date: foundFoodObject[0].vaccuming_date,
        packed_on_date: foundFoodObject[0].packed_on_date,
        freeze_date: foundFoodObject[0].freeze_date,
        company_id: req.body.company_id,
        thaw_date: foundFoodObject[0].thaw_date,
        best_before_date: foundFoodObject[0].best_before_date,
        delivery_note_image_path: foundFoodObject[0].delivery_note_image_path,
        food_item_image_path: foundFoodObject[0].food_item_image_path,
      });
      food_objects.destroy({ where: { id: foundFoodObject[0].id } });
      qr_codes.update(
        { is_removed: true },
        { where: { id: req.body.qr_code_id } }
      );
    });
  res.send(true);
};

// function saveImage(imageData, type) {
//   return new Promise((resolve, reject) => {
//     if (imageData.length != 0) {
//       const matches = imageData[0].match(/^data:(image\/\w+);base64,(.+)$/);

//       const mimeType = matches[1];
//       const base64Data = imageData[0].replace(/^data:image\/\w+;base64,/, "");
//       const buffer = Buffer.from(base64Data, "base64");
//       const extension = mimeType.split("/")[1];
//       console.log(extension);
//       const timestamp = Date.now();
//       const random = Math.floor(Math.random() * 1000);
//       const filename = `image_${timestamp}_${random}.${extension}`;
//       const uploadPath = path.join(
//         "./app/filesys/company/1/category/qrcode/workspaces/",
//         type,
//         filename
//       );

//       const generateUniqueFilename = (filePath) => {
//         if (fs.existsSync(filePath)) {
//           const newRandom = Math.floor(Math.random() * 1000);
//           const newFilename = `image_${timestamp}_${newRandom}.png`;
//           return path.join(
//             "./app/filesys/company/1/category/qrcode/food/",
//             type,
//             newFilename
//           );
//         }
//         return filePath;
//       };

//       const uniqueFilePath = generateUniqueFilename(uploadPath);

//       fs.mkdirSync(path.dirname(uniqueFilePath), { recursive: true });

//       fs.writeFile(uniqueFilePath, buffer, (err) => {
//         if (err) {
//           console.error("Failed to save image:", err);
//           reject(err);
//         } else {
//           console.log("Image saved successfully at:", uniqueFilePath);
//           resolve(uniqueFilePath);
//         }
//       });
//     } else {
//       reject("No image data provided");
//     }
//   });
// }

exports.changeFoodStatus = (req, res) => {
  const status_code = req.query.status_code;
  const qr_code_id = req.query.qr_code_id;
  const user_id = req.query.user_id;
  const measuredTemp = req.query.measured_temperature;
  const reported_quantity = req.query.reported_quantity;
  const company_id = req.query.company_id;

  console.log(status_code);
  if (
    status_code == "1" ||
    status_code == "2" ||
    status_code == "3" ||
    status_code == "4" ||
    status_code == "5" ||
    status_code == "6" ||
    status_code == "7" ||
    status_code == "8"
  ) {
    if (status_code == "1") {
      food_objects
        .update(
          {
            freeze_date: dateHandler.getCurrentDate(),
          },
          {
            where: { qr_code_id: qr_code_id },
          }
        )
        .then((data) => {
          food_objects_logs.create({
            qr_code_id: qr_code_id,
            employee_id: user_id,
            action_id: status_code,
            company_id: company_id,
          });
          res.send(true);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message ||
              "Some error occurred while updating the API information.",
          });
        });
    } else if (status_code == "2") {
      food_objects
        .update(
          {
            thaw_date: dateHandler.getCurrentDate(),
          },
          {
            where: { qr_code_id: qr_code_id },
          }
        )
        .then((data) => {
          food_objects_logs.create({
            qr_code_id: qr_code_id,
            employee_id: user_id,
            action_id: status_code,
            company_id: company_id,
          });
          res.send(true);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message ||
              "Some error occurred while updating the API information.",
          });
        });
    } else if (status_code == "3") {
      food_objects
        .findAll({ where: { qr_code_id: qr_code_id } })
        .then((foundFoodObject) => {
          food_objects_history.create({
            qr_code_id: foundFoodObject[0].qr_code_id,
            product_id: foundFoodObject[0].product_id,
            batch_number: foundFoodObject[0].batch_number,
            quantity: foundFoodObject[0].quantity,
            delivery_temperature: foundFoodObject[0].delivery_temperature,
            store_temperature: foundFoodObject[0].store_temperature,
            opening_date: foundFoodObject[0].opening_date,
            vaccuming_date: foundFoodObject[0].vaccuming_date,
            packed_on_date: foundFoodObject[0].packed_on_date,
            freeze_date: foundFoodObject[0].freeze_date,
            thaw_date: foundFoodObject[0].thaw_date,
            company_id: company_id,
            best_before_date: foundFoodObject[0].best_before_date,
            delivery_note_image_path:
              foundFoodObject[0].delivery_note_image_path,
            food_item_image_path: foundFoodObject[0].food_item_image_path,
          });
          food_objects_logs.create({
            qr_code_id: qr_code_id,
            employee_id: user_id,
            company_id: company_id,
            action_id: status_code,
          });
          food_objects.destroy({ where: { id: foundFoodObject[0].id } });
          qr_codes.update({ is_removed: true }, { where: { id: qr_code_id } });
          res.send(true);
        });
    } else if (status_code == "4") {
      food_objects
        .update(
          {
            opening_date: dateHandler.getCurrentDate(),
          },
          {
            where: { qr_code_id: qr_code_id },
          }
        )
        .then((data) => {
          food_objects_logs.create({
            qr_code_id: qr_code_id,
            employee_id: user_id,
            action_id: status_code,
          });
          res.send(true);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message ||
              "Some error occurred while updating the API information.",
          });
        });
    } else if (status_code == "5") {
      food_objects
        .update(
          {
            vaccuming_date: dateHandler.getCurrentDate(),
          },
          {
            where: { qr_code_id: qr_code_id },
          }
        )
        .then((data) => {
          food_objects_logs.create({
            qr_code_id: qr_code_id,
            employee_id: user_id,
            action_id: status_code,
            company_id: company_id,
          });
          res.send(true);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message ||
              "Some error occurred while updating the API information.",
          });
        });
    } else if (status_code == "6") {
      food_objects_logs.create({
        qr_code_id: qr_code_id,
        employee_id: user_id,
        action_id: status_code,
        measured_temperature: measuredTemp,
        company_id: company_id,
      });
    } else if (status_code == "7") {
      food_objects_logs.create({
        qr_code_id: qr_code_id,
        employee_id: user_id,
        action_id: status_code,
        reported_quantity: reported_quantity,
        company_id: company_id,
      });
      food_objects.update(
        {
          quantity: reported_quantity,
        },
        {
          where: { qr_code_id: qr_code_id },
        }
      );
    } else if (status_code == "8") {
      food_objects
        .findAll({ where: { qr_code_id: qr_code_id } })
        .then((foundFoodObject) => {
          food_objects_logs.create({
            qr_code_id: qr_code_id,
            employee_id: user_id,
            action_id: status_code,
            reported_quantity: foundFoodObject[0].quantity,
            company_id: company_id,
          });
          food_objects_history.create({
            qr_code_id: foundFoodObject[0].qr_code_id,
            product_id: foundFoodObject[0].product_id,
            batch_number: foundFoodObject[0].batch_number,
            quantity: foundFoodObject[0].quantity,
            delivery_temperature: foundFoodObject[0].delivery_temperature,
            store_temperature: foundFoodObject[0].store_temperature,
            opening_date: foundFoodObject[0].opening_date,
            vaccuming_date: foundFoodObject[0].vaccuming_date,
            packed_on_date: foundFoodObject[0].packed_on_date,
            freeze_date: foundFoodObject[0].freeze_date,
            thaw_date: foundFoodObject[0].thaw_date,
            best_before_date: foundFoodObject[0].best_before_date,
            delivery_note_image_path:
              foundFoodObject[0].delivery_note_image_path,
            food_item_image_path: foundFoodObject[0].food_item_image_path,
          });
          food_objects.destroy({ where: { id: foundFoodObject[0].id } });
          qr_codes.update({ is_removed: true }, { where: { id: qr_code_id } });
        });
    }
  } else {
    res.status(500).send({ message: "Unknown status code." });
  }
};

exports.getDeliveryNote = async (req, res) => {
  const qr_code_id = req.query.id;
  console.log("ASDAOSIDJASOIDJ");
  console.log(qr_code_id);

  food_objects
    .findAll({ where: { qr_code_id: qr_code_id } })
    .then(async (foundFoodItems) => {
      if (foundFoodItems.length > 0) {
        try {
          const image = await imageHandler.displayImageAsBase64(
            foundFoodItems[0].delivery_note_image_path
          );
          res.send([image]);
        } catch (err) {
          res.send(err);
        }
      } else {
        food_objects_history
          .findAll({ where: { qr_code_id: qr_code_id } })
          .then(async (foundHistoryFoodItems) => {
            if (foundHistoryFoodItems.length > 0) {
              try {
                const imageDelivery = await imageHandler.displayImageAsBase64(
                  foundHistoryFoodItems[0].delivery_note_image_path
                );
                res.send([imageDelivery]);
              } catch (err) {
                res.send(err);
              }
            } else {
              res.send(false);
            }
          });
      }
    });
};

exports.getDeliveryImage = async (req, res) => {
  const qr_code_id = req.query.id;

  food_objects
    .findAll({ where: { qr_code_id: qr_code_id } })
    .then(async (foundFoodItems) => {
      if (foundFoodItems.length > 0) {
        try {
          const image = await imageHandler.displayImageAsBase64(
            foundFoodItems[0].food_item_image_path
          );
          res.send([image]);
        } catch (err) {
          res.send(err);
        }
      } else {
        food_objects_history
          .findAll({ where: { qr_code_id: qr_code_id } })
          .then(async (foundHistoryFoodItems) => {
            if (foundHistoryFoodItems.length > 0) {
              try {
                const image = await imageHandler.displayImageAsBase64(
                  foundHistoryFoodItems[0].food_item_image_path
                );
                res.send([image]);
              } catch (err) {
                res.send(err);
              }
            } else {
              res.send(false);
            }
          });
      }
    });
};

exports.addNewFoodQrCode = async (req, res) => {
  const qr_code_str = req.body.qr_code_str;
  const category_id = req.body.category_id;
  const product_name = req.body.product_name;
  const packed_on_date = req.body.packed_on_date;
  const best_before_date = req.body.best_before_date;
  const user_id = req.body.user_id;
  const batch_number = req.body.batch_number;
  const quantity = req.body.quantity;
  const delivery_temperature = req.body.delivery_temperature;
  const delivery_note_image = req.body.delivery_note_image;
  const food_item_image = req.body.food_item_image;

  const deliveryNoteFilePath = await imageHandler.saveImage([
    delivery_note_image,
  ]);

  const foodItemFilePath = await imageHandler.saveImage([food_item_image]);

  var qr_code_id;
  await qr_codes
    .findAll({ where: { qr_code_id: qr_code_str } })
    .then((foundQrCode) => {
      qr_code_id = foundQrCode[0].id;
    });

  await qr_codes.update(
    {
      category_id: category_id,
      is_active: true,
    },
    {
      where: { id: qr_code_id },
    }
  );

  var productId;

  await product_names
    .findAll({ where: { product_name: product_name } })
    .then(async (foundProductName) => {
      console.log(foundProductName.length);
      if (foundProductName.length == 0) {
        var response = await product_names.create({
          product_name: product_name,
          company_id: req.body.company_id,
        });
        productId = response.id;
      } else {
        productId = foundProductName[0].id;
      }
    });

  await food_objects.create({
    qr_code_id: qr_code_id,
    packed_on_date: packed_on_date,
    best_before_date: best_before_date,
    product_id: productId,
    quantity: quantity,
    batch_number: batch_number,
    delivery_temperature: delivery_temperature,
    delivery_note_image_path: deliveryNoteFilePath,
    food_item_image_path: foodItemFilePath,
    company_id: req.body.company_id,
  });

  await food_objects_logs.create({
    qr_code_id: qr_code_id,
    employee_id: user_id,
    action_id: 0,
    company_id: req.body.company_id,
  });
  res.send(true);
};

exports.getFoodLogs = (req, res) => {
  const qr_code_id = req.query.qr_code_id;
  food_objects_logs
    .findAll({ where: { qr_code_id: qr_code_id } })
    .then((foundFoodLogs) => {
      const promises = [];
      for (let i = 0; i < foundFoodLogs.length; i++) {
        promises.push(
          users
            .findAll({ where: { id: foundFoodLogs[i].employee_id } })
            .then((foundUser) => {
              foundFoodLogs[i].dataValues.employee_name =
                foundUser[0].name + " " + foundUser[0].surname;
            })
        );
      }
      // Wait for all promises to resolve
      return Promise.all(promises).then(() => foundFoodLogs);
    })
    .then((foundFoodLogsWithNames) => {
      // Now all promises have resolved, send the response
      res.send(foundFoodLogsWithNames);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving the API Infos.",
      });
    });
};

exports.getProductNames = (req, res) => {
  company_id = req.query.company_id;
  product_names
    .findAll({ where: (company_id = { company_id }) })
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving the API Infos.",
      });
    });
};
