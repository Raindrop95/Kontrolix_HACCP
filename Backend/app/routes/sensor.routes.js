module.exports = (app) => {
  const sensor = require("../controllers/Sensor/sensor.controller");

  var router = require("express").Router();

  router.post("/activateSensor", sensor.activateSensor);
  router.post("/newSensorReading", sensor.newSensorReading);
  router.get("/getLastReadings", sensor.getLastReadings);
  router.get("/getActiveSensors", sensor.getActiveSensors);
  router.get("/getAllSensors", sensor.getAllSensors);
  router.post("/toggleSensor", sensor.toggleSensor);
  router.delete("/deleteSensor/:id", sensor.deleteSensor);
  router.post("/addSensor", sensor.addSensor);
  app.use("/api/category/sensor", router);
};
