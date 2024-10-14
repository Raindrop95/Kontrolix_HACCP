module.exports = (app) => {
  const history = require("../controllers/History/history.controller");

  var router = require("express").Router();

  router.get("/getAllHistoryFoodQrCodes", history.getAllHistoryFoodQrCodes);

  app.use("/api/history", router);
};
