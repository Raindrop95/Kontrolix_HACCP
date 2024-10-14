module.exports = (app) => {
  const food = require("../controllers/Categroy/Food/food.controller");

  var router = require("express").Router();

  router.post("/changeFoodStatus", food.changeFoodStatus);
  router.post("/addNewFoodQrCode", food.addNewFoodQrCode);
  router.get("/getFoodLogs", food.getFoodLogs);
  router.get("/getProductNames", food.getProductNames);
  router.get("/getThrowAwayLog", food.getThrowAwayLog);

  router.get("/getDeliveryNote", food.getDeliveryNote);

  router.get("/getDeliveryImage", food.getDeliveryImage);

  router.post("/throwFoodItemAway", food.throwFoodItemAway);

  app.use("/api/category/food", router);
};
