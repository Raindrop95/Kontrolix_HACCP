const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // Save User to Database
  console.log("CREATE1234");
  User.create({
    company_id: req.body.company,
    username: req.body.username,
    role: req.body.roles,
    email: req.body.email,
    name: req.body.name,
    surname: req.body.surname,
    password: bcrypt.hashSync(req.body.password, 8),
    isActive: 1,
  })
    .then((user) => {
      // res.send({ message: "User was registered successfully!" });
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: req.body.roles,
          },
        }).then((roles) => {
          user.setRoles(roles).then(() => {
            res.send({ message: "User was registered successfully!" });
          });
        });
      } else {
        // user role = 1
        user.setRoles([2]).then(() => {
          res.send({ message: "User was registered successfully!" });
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .send({ message: "Invalid Username or Password!" });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      console.log(bcrypt.decodeBase64(user.password));

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Username or Password!",
        });
      }

      if (user.isActive == 0) {
        return res.status(401).send({
          accessToken: null,
          message: "Useraccount is deactivated!",
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      var authorities = [];
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token,
          company_id: user.company_id,
        });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
