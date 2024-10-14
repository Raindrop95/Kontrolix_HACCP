const dateHandler = require("../../Functions/dateHandler");
const db = require("../../../models");
const imageHandler = require("../../Functions/ftpImageHandler");

var bcrypt = require("bcryptjs");
const multer = require("multer");
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
}).single("image");
const fs = require("fs");
const path = require("path");
const { type } = require("os");
const { where } = require("sequelize");
const workspace_objects = db.workspace_objects;
const workspace_objects_logs = db.workspace_objects_logs;
const qr_codes = db.qr_codes;
const cleaningAgents = db.cleaning_agents;

exports.newCleaningAgent = async (req, res) => {
  const uniqueFilePath = await imageHandler.saveImage(
    req.body.informationSheet
  );

  cleaningAgents.create({
    agent_name: req.body.name,
    agent_details_photo_path: uniqueFilePath,
    company_id: req.body.company_id,
  });

  res.send(true);
};

exports.editCleaningAgent = async (req, res) => {
  const agentID = req.body.id;
  const newName = req.body.newName;

  if (req.body.newInformationSheet != null) {
    const uniqueFilePath = await imageHandler.saveImage(
      req.body.newInformationSheet
    );

    cleaningAgents.update(
      { agent_details_photo_path: uniqueFilePath },
      { where: { id: agentID } }
    );
  }

  if (newName != "") {
    cleaningAgents.update({ agent_name: newName }, { where: { id: agentID } });
  }

  res.send(true);
};

exports.deleteCleaningAgent = (req, res) => {
  cleaningAgents.update({ isDeleted: true }, { where: { id: req.query.id } });
  res.send(true);
};

exports.getInformationSheet = (req, res) => {
  const cleaningAgent_id = req.query.id;

  try {
    cleaningAgents
      .findAll({ where: { id: cleaningAgent_id } })
      .then(async (agent) => {
        console.log(cleaningAgent_id);
        const image = await imageHandler.displayImageAsBase64(
          agent[0].agent_details_photo_path
        );
        res.send([image]);
      });
  } catch (err) {
    res.send(err);
  }
};

// exports.uploadImage = (req, res) => {
//   const images = req.body; // Expecting an array of base64 strings
//   if (!images || images.length === 0) {
//     console.error("No image data received.");
//     return res.status(400).send("No image data received.");
//   }

//   // Process the first image for simplicity, you can loop through all if needed
//   const base64Data = images[0].replace(/^data:image\/\w+;base64,/, "");
//   const buffer = Buffer.from(base64Data, "base64");

//   // Generate a unique filename for the image
//   const timestamp = Date.now();
//   const random = Math.floor(Math.random() * 1000);
//   const filename = `image_${timestamp}_${random}.png`;
//   const uploadPath = path.join("./app/uploads", filename);

//   // Check if file exists and generate a new name if it does
//   const generateUniqueFilename = (filePath) => {
//     if (fs.existsSync(filePath)) {
//       const newRandom = Math.floor(Math.random() * 1000);
//       const newFilename = `image_${timestamp}_${newRandom}.png`;
//       return path.join("./app/uploads", newFilename);
//     }
//     return filePath;
//   };

//   const uniqueFilePath = generateUniqueFilename(uploadPath);

//   // Save buffer to file
//   fs.writeFile(uniqueFilePath, buffer, (err) => {
//     if (err) {
//       console.error("Failed to save image:", err);
//       return res.status(500).send("Failed to save image");
//     }

//     console.log("Image saved successfully at:", uniqueFilePath);
//     res.json({ resultImage: images[0] });
//   });
// };

exports.addWorkspaceLog = async (req, res) => {
  const usedCleaningAgents = req.body.cleaning_agents;
  const currentConditionImage = req.body.condition_image;
  const userId = req.body.user_id;
  const qr_code_id = req.body.qr_code_id;
  const uniqueFilePath = await imageHandler.saveImage(currentConditionImage);

  const arr_cleaning_agents = usedCleaningAgents;
  var arr_cleaning_agents_ids = [];

  await Promise.all(
    arr_cleaning_agents.map(async (agentName, index) => {
      const foundAgentName = await db.cleaning_agents.findAll({
        where: { agent_name: agentName },
      });
      if (foundAgentName.length === 0) {
        const response = await db.cleaning_agents.create({
          agent_name: agentName,
          company_id: req.body.company_id,
        });
        arr_cleaning_agents_ids[index] = response.id;
      } else {
        arr_cleaning_agents_ids[index] = foundAgentName[0].id;
      }
    })
  );

  const foundIds = arr_cleaning_agents_ids.join(",");

  workspace_objects_logs.create({
    qr_code_id: qr_code_id,
    user_id: userId,
    cleaning_agents: foundIds,
    condition_image: uniqueFilePath,
    company_id: req.body.company_id,
  });

  res.send(true);
};

exports.getWorkspaceLogs = async (req, res) => {
  const qr_code_id = req.query.qr_code_id;

  try {
    const workspaceLogs = await workspace_objects_logs.findAll({
      where: { qr_code_id: qr_code_id },
    });

    for (let i = 0; i < workspaceLogs.length; i++) {
      const cleaningIdArr = workspaceLogs[i].cleaning_agents.split(",");
      const cleaningIdStrArr = []; // Initialize cleaningIdStrArr here
      const promises = [];

      for (let j = 0; j < cleaningIdArr.length; j++) {
        promises.push(
          db.cleaning_agents
            .findAll({ where: { id: cleaningIdArr[j] } })
            .then((cleaningAgent) => {
              cleaningIdStrArr[j] = cleaningAgent[0].agent_name;
            })
        );
      }

      promises.push(
        db.user
          .findAll({ where: { id: workspaceLogs[i].user_id } })
          .then((users) => {
            workspaceLogs[i].user_id = users[0].name + " " + users[0].surname;
          })
      );

      await Promise.all(promises);

      workspaceLogs[i].cleaning_agents = cleaningIdStrArr.join(",");
    }

    res.send(workspaceLogs);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.getWorkspaceLogImage = (req, res) => {
  const log_id = req.query.log_id;

  try {
    workspace_objects_logs
      .findAll({ where: { id: log_id } })
      .then(async (log) => {
        const image = await imageHandler.displayImageAsBase64(
          log[0].condition_image
        );

        res.send([image]);
      });
  } catch (err) {
    res.send(err);
  }
};

exports.addNewWorkspaceCode = async (req, res) => {
  const currentQrCode = req.body.currentQrCode;
  const workspace_name = req.body.workspace_name;
  const preferred_cleaning_agents = req.body.preferred_cleaning_agents;
  const preferred_codition_image = req.body.imageData;

  // Wait for saveImage to complete before continuing
  const uniqueFilePath = await imageHandler.saveImage(preferred_codition_image);
  console.log(uniqueFilePath);

  const arr_cleaning_agents = preferred_cleaning_agents;
  var arr_cleaning_agents_ids = [];

  await Promise.all(
    arr_cleaning_agents.map(async (agentName, index) => {
      const foundAgentName = await db.cleaning_agents.findAll({
        where: { agent_name: agentName },
      });
      if (foundAgentName.length === 0) {
        const response = await db.cleaning_agents.create({
          agent_name: agentName,
          company_id: req.body.company_id,
        });
        arr_cleaning_agents_ids[index] = response.id;
      } else {
        arr_cleaning_agents_ids[index] = foundAgentName[0].id;
      }
    })
  );

  const foundIds = arr_cleaning_agents_ids.join(",");

  const foundQrCode = await qr_codes.findAll({
    where: { qr_code_id: currentQrCode },
  });

  await workspace_objects.create({
    qr_code_id: foundQrCode[0].id,
    workspace_name: workspace_name,
    preferred_cleaning_agent: foundIds.toString(),
    preferred_condition_image: uniqueFilePath, // Use the unique file path here
    company_id: req.body.company_id,
  });

  await qr_codes.update(
    {
      category_id: 2,
      is_active: true,
    },
    {
      where: { id: foundQrCode[0].id },
    }
  );

  res.send(true);
};

exports.getAllWorkspaces = async (req, res) => {
  try {
    const workspaces = await workspace_objects.findAll({
      where: { company_id: req.query.company_id },
    });

    for (let i = 0; i < workspaces.length; i++) {
      // Fetch QR code asynchronously and wait for the result
      const qrCode = await qr_codes.findOne({
        where: { id: workspaces[i].qr_code_id },
      });

      // Assign qr_code_str to workspace
      if (qrCode) {
        workspaces[i].dataValues.qr_code_str = qrCode.qr_code_id;
      }

      const cleaningAgentsStrArr = [];
      const cleaningAgents = workspaces[i].preferred_cleaning_agent.split(",");

      // Fetch all cleaning agents concurrently
      const promises = cleaningAgents.map(async (cleaningAgentId) => {
        const cleaningAgent = await db.cleaning_agents.findOne({
          where: { id: cleaningAgentId },
        });
        if (cleaningAgent) {
          cleaningAgentsStrArr.push(cleaningAgent.agent_name);
        }
      });

      await Promise.all(promises); // Wait for all promises to resolve

      workspaces[i].preferred_cleaning_agent = cleaningAgentsStrArr.join(",");
    }

    res.send(workspaces);
  } catch (error) {
    console.error("Error fetching workspaces:", error);
    res.status(500).send("Internal server error");
  }
};

exports.deleteWorkspace = async (req, res) => {
  await workspace_objects
    .findAll({ where: { id: req.query.workspace_id } })
    .then(async (workspaceObject) => {
      await db.workspace_objects_histories.create({
        qr_code_id: workspaceObject[0].qr_code_id,
        workspace_name: workspaceObject[0].workspace_name,
        company_id: workspaceObject[0].company_id,
        preferred_cleaning_agent: workspaceObject[0].preferred_cleaning_agent,
      });
      await qr_codes.update(
        {
          is_active: false,
          is_removed: true,
        },
        {
          where: { id: workspaceObject[0].qr_code_id },
        }
      );
      workspace_objects.destroy({ where: { id: req.query.workspace_id } });
      res.send(true);
    });
};

exports.getWorkspaceHistory = async (req, res) => {
  try {
    const workspaces = await db.workspace_objects_histories.findAll({
      where: { company_id: req.query.company_id },
    });

    for (let i = 0; i < workspaces.length; i++) {
      // Fetch QR code asynchronously and wait for the result
      const qrCode = await qr_codes.findOne({
        where: { id: workspaces[i].qr_code_id },
      });

      // Assign qr_code_str to workspace
      if (qrCode) {
        workspaces[i].dataValues.qr_code_str = qrCode.qr_code_id;
      }

      const cleaningAgentsStrArr = [];
      const cleaningAgents = workspaces[i].preferred_cleaning_agent.split(",");

      // Fetch all cleaning agents concurrently
      const promises = cleaningAgents.map(async (cleaningAgentId) => {
        const cleaningAgent = await db.cleaning_agents.findOne({
          where: { id: cleaningAgentId },
        });
        if (cleaningAgent) {
          cleaningAgentsStrArr.push(cleaningAgent.agent_name);
        }
      });

      await Promise.all(promises); // Wait for all promises to resolve

      workspaces[i].preferred_cleaning_agent = cleaningAgentsStrArr.join(",");
    }

    res.send(workspaces);
  } catch (error) {
    console.error("Error fetching workspaces:", error);
    res.status(500).send("Internal server error");
  }
};

exports.getAllActiveCleaningAgents = async (req, res) => {
  db.cleaning_agents
    .findAll({ where: { isDeleted: false, company_id: req.query.company_id } })
    .then((response) => {
      res.send(response);
    });
};

exports.getAllCleaningAgents = async (req, res) => {
  db.cleaning_agents
    .findAll({ where: { company_id: req.query.company_id } })
    .then((response) => {
      res.send(response);
    });
};

exports.getCleaningAgentById = (req, res) => {
  const id = req.query.id;

  db.cleaning_agents.findAll({ where: { id: id } }).then((response) => {
    res.send(response);
  });
};
