module.exports = (app) => {
  const location = require("../controllers/Categroy/Location/location.controller.js");

  var router = require("express").Router();

  router.post("/addNewLocationCode", location.addNewLocationCode);

  router.post("/addLocationLog", location.addLocationLog);
  router.get("/deleteLocation", location.deleteLocation);
  router.get("/getAllLocations", location.getAllLocations);
  router.get("/getLocationLogs", location.getLocationLogs);
  router.get("/getLocationHistory", location.getLocationHistory);
  router.get("/getLocationLogImage", location.getLocationLogImage);
  router.post("/editLocationData", location.editLocationData);

  // Only include routes that exist in the location controller
  if (typeof location.editCleaningAgent === 'function') {
    router.post("/editCleaningAgent", location.editCleaningAgent);
  }
  if (typeof location.getAllCleaningAgents === 'function') {
    router.get("/getAllCleaningAgents", location.getAllCleaningAgents);
  }
  if (typeof location.getAllActiveCleaningAgents === 'function') {
    router.get("/getAllActiveCleaningAgents", location.getAllActiveCleaningAgents);
  }
  if (typeof location.getCleaningAgentById === 'function') {
    router.get("/getCleaningAgentById", location.getCleaningAgentById);
  }
  if (typeof location.newCleaningAgent === 'function') {
    router.post("/newCleaningAgent", location.newCleaningAgent);
  }
  if (typeof location.deleteCleaningAgent === 'function') {
    router.get("/deleteCleaningAgent", location.deleteCleaningAgent);
  }
  if (typeof location.getInformationSheet === 'function') {
    router.get("/getInformationSheet", location.getInformationSheet);
  }

  // Edit location data


  app.use("/api/category/location", router);
};