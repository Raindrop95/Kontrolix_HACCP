const dateHandler = require("./Functions/dateHandler");
const db = require("../models");
const Op = db.Sequelize.Op;
var bcrypt = require("bcryptjs");
const path = require("path");
const users = db.user;
const roles = db.role;
const company = db.companies;
const imageHandler = require("../controllers/Functions/ftpImageHandler.js");

var bcrypt = require("bcryptjs");
const multer = require("multer");
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
}).single("image");
const fs = require("fs");

exports.getUserData = (req, res) => {
  const user_id = req.query.user_id;
  users
    .findAll({ where: { user_id: user_id } })
    .then((foundUserData) => {
      res.send(foundUserData);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving the API Infos.",
      });
    });
};

exports.getCompanyInformation = (req, res) => {
  const company_id = req.query.company_id;

  company.findAll({ where: { id: company_id } }).then((company_details) => {
    res.send(company_details[0]);
  });
};

exports.deleteUser = (req, res) => {
  const userId = req.query.user_id;

  users.update({ isActive: 0 }, { where: { id: userId } });
  res.send(true);
};

exports.getRoles = (req, res) => {
  roles.findAll().then((foundRoles) => {
    res.send(foundRoles);
  });
};

exports.updateUser = (req, res) => {
  const userId = req.query.user_id;
  const username = req.query.username;
  const name = req.query.name;
  const surname = req.query.surname;
  const email = req.query.email;
  const password = bcrypt.hashSync(req.query.password, 8);

  users
    .update(
      {
        username: username,
        name: name,
        surname: surname,
        email: email,
      },
      {
        where: { id: userId },
      }
    )
    .then((data) => {
      if (req.query.password != "") {
        users.update(
          {
            password: password,
          },
          {
            where: { id: userId },
          }
        );
      }
      users.findAll({ where: { id: userId } }).then((foundUser) => {
        db.role
          .findAll({
            where: {
              name: req.query.roles,
            },
          })
          .then((roles) => {
            foundUser[0].setRoles(roles).then(() => {
              res.send({ message: "User was edited successfully!" });
            });
          });
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while updating the API information.",
      });
    });
};

exports.getAllUsers = (req, res) => {
  const company_id = req.query.company_id;
  console.log("asdasdasd");
  users
    .findAll({
      where: {
        company_id: company_id,
        role: { [Op.not]: "Masteruser" },
        isActive: true,
      },
    })
    .then(async (foundUserData) => {
      console.log("asdasdasd2");
      for (let i = 0; i < foundUserData.length; i++) {
        await foundUserData[i].getRoles().then((foundRole) => {
          foundUserData[i].role = foundRole[0].name;
        });
      }

      res.send(foundUserData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving the API Infos.",
      });
    });
};

exports.getUserData = (req, res) => {
  const user_id = req.query.user_id;

  users
    .findAll({ where: { id: user_id } })
    .then((foundUserData) => {
      foundUserData[0].getRoles().then((foundRole) => {
        foundUserData[0].role = foundRole[0].name;
      });
      res.send(foundUserData);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving the API Infos.",
      });
    });
};

exports.changeUserImage = async (req, res) => {
  const user_id = req.body.user_id;
  const user_image = req.body.user_image;

  // Wait for saveImage to complete before continuing
  const uniqueFilePath = await imageHandler.saveImage(user_image);

  users.update(
    {
      user_image_path: uniqueFilePath,
    },
    {
      where: { id: user_id },
    }
  );
};

exports.deleteUserImage = (req, res) => {
  const user_id = req.query.user_id;
  users.update({ user_image_path: null }, { where: { id: user_id } });
};

exports.getUserImage = async (req, res) => {
  const user_id = req.query.user_id;

  try {
    users.findAll({ where: { id: user_id } }).then(async (user) => {
      if (user[0].user_image_path != null && user[0].user_image_path != "") {
        const image = await imageHandler.displayImageAsBase64(
          user[0].user_image_path
        );
        res.send([image]);
      } else {
        res.send(false);
      }
    });
  } catch (err) {
    res.send(err);
  }
};

function saveImage(imageData, type) {
  return new Promise((resolve, reject) => {
    if (imageData.length != 0) {
      const matches = imageData[0].match(/^data:(image\/\w+);base64,(.+)$/);
      const mimeType = matches[1];
      const base64Data = imageData[0].replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      const extension = mimeType.split("/")[1];
      console.log(extension);
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 1000);
      const filename = `image_${timestamp}_${random}.${extension}`;
      const uploadPath = path.join("./app/filesys/company/1/", type, filename);

      const generateUniqueFilename = (filePath) => {
        if (fs.existsSync(filePath)) {
          const newRandom = Math.floor(Math.random() * 1000);
          const newFilename = `image_${timestamp}_${newRandom}.png`;
          return path.join("./app/filesys/company/1/", type, newFilename);
        }
        return filePath;
      };

      const uniqueFilePath = generateUniqueFilename(uploadPath);

      fs.mkdirSync(path.dirname(uniqueFilePath), { recursive: true });

      fs.writeFile(uniqueFilePath, buffer, (err) => {
        if (err) {
          console.error("Failed to save image:", err);
          reject(err);
        } else {
          console.log("Image saved successfully at:", uniqueFilePath);
          resolve(uniqueFilePath);
        }
      });
    } else {
      reject("No image data provided");
    }
  });
}
