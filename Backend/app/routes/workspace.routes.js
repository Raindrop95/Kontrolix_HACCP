module.exports = (app) => {
  const workspace = require("../controllers/Categroy/Workspace/workspace.controller.js");
  const oil = require("../controllers/Oil/oil.controller.js");

  var router = require("express").Router();
  // router.post("/uploadImage", workspace.uploadImage);
  router.post("/addNewWorkspaceCode", workspace.addNewWorkspaceCode);
  router.post("/addWorkspaceLog", workspace.addWorkspaceLog);
  router.post("/editCleaningAgent", workspace.editCleaningAgent);

  router.get("/deleteWorkspace", workspace.deleteWorkspace);

  router.get("/getAllCleaningAgents", workspace.getAllCleaningAgents);
  router.get(
    "/getAllActiveCleaningAgents",
    workspace.getAllActiveCleaningAgents
  );

  router.get("/getWorkspaceLogs", workspace.getWorkspaceLogs);

  router.get("/getCleaningAgentById", workspace.getCleaningAgentById);
  router.get("/getAllWorkspaces", workspace.getAllWorkspaces);
  router.get("/getWorkspaceHistory", workspace.getWorkspaceHistory);
  router.get("/getWorkspaceLogImage", workspace.getWorkspaceLogImage);

  router.post("/newCleaningAgent", workspace.newCleaningAgent);
  router.get("/deleteCleaningAgent", workspace.deleteCleaningAgent);
  router.get("/getInformationSheet", workspace.getInformationSheet);

  //Oils

  router.get("/getAllOilChanges", oil.getAllOilChanges);
  router.post("/addNewOilChange", oil.addNewOilChange);
  router.post("/editOilChange", oil.editOilChange);
  router.post("/deleteOilChange", oil.deleteOilChange);

  app.use("/api/category/workspace", router);
};
