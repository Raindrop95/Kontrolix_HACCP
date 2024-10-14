module.exports = (app) => {
  const users = require("../controllers/user_mgnt.controller");

  var router = require("express").Router();

  router.get("/getUserData", users.getUserData);
  router.post("/deleteUser", users.deleteUser);
  router.post("/updateUser", users.updateUser);
  router.get("/getUserData", users.getUserData);
  router.get("/getAllUsers", users.getAllUsers);
  router.get("/getRoles", users.getRoles);
  router.post("/changeUserImage", users.changeUserImage);

  router.get("/getCompanyInformation", users.getCompanyInformation);

  router.get("/getUserImage", users.getUserImage);
  router.get("/deleteUserImage", users.deleteUserImage);

  app.use("/api/users/", router);
};
