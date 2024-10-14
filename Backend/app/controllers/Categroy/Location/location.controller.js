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
const location_objects = db.location_objects;
const location_objects_logs = db.location_objects_logs;
const cleaningAgents = db.cleaning_agents;
const qr_codes = db.qr_codes;

exports.addNewLocationCode = async (req, res) => {
  try {
    console.log("Received request body:", JSON.stringify(req.body, null, 2));
    
    const { currentQrCode, location_name, preferred_cleaning_agents, imageData, company_id } = req.body.currentQrCode || {};
    req.body = { currentQrCode, location_name, preferred_cleaning_agents, imageData, company_id };
    if (!currentQrCode || !location_name || !preferred_cleaning_agents || !imageData || !company_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let uniqueFilePath;
    try {
      uniqueFilePath = await imageHandler.saveImage([imageData], 'location', 'condition', company_id);
    } catch (imageError) {
      console.error("Error saving image:", imageError);
      return res.status(400).json({ error: "Failed to save image. Invalid image data format." });
    }

    const foundAgentName = await db.cleaning_agents.findAll({
      where: {
        agent_name: preferred_cleaning_agents,
        company_id: company_id
      }
    });

    const arr_cleaning_agents_ids = await Promise.all(
      preferred_cleaning_agents.map(async (agentName) => {
        let foundAgent = foundAgentName.find(agent => agent.agent_name === agentName);
        if (!foundAgent) {
          foundAgent = await db.cleaning_agents.create({
            agent_name: agentName,
            company_id,
          });
        }
        return foundAgent.id;
      })
    );

    const foundQrCode = await qr_codes.findOne({
      where: { qr_code_id: currentQrCode },
    });

    if (!foundQrCode) {
      return res.status(404).json({ error: "QR code not found" });
    }

    try {
      await location_objects.create({
        qr_code_id: foundQrCode.id,
        location_name,
        preferred_cleaning_agent: arr_cleaning_agents_ids.join(","),
        preferred_condition_image: uniqueFilePath,
        company_id,
      });
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ error: "A location with this QR code already exists" });
      }
      throw error;
    }

    await qr_codes.update(
      { is_active: true },
      { where: { id: foundQrCode.id } }
    );

    return res.status(200).json({ success: true, message: "Location code added successfully" });
  } catch (error) {
    console.error("Error in addNewLocationCode:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.addLocationLog = async (req, res) => {
  try {
    const { qr_code_id, cleaning_agent_id, condition_image, company_id } = req.body;

    // Validate required fields
    if (!qr_code_id || !cleaning_agent_id || !condition_image || !company_id) {
      let missingFields = [];
    
      if (!qr_code_id) {
        missingFields.push("qr_code_id");
        console.log("qr_code_id is missing");
      }
    
      if (!cleaning_agent_id) {
        missingFields.push("cleaning_agent_id");
        console.log("cleaning_agent_id is missing");
      }
    
      if (!condition_image) {
        missingFields.push("condition_image");
        console.log("condition_image is missing");
      }
    
      if (!company_id) {
        missingFields.push("company_id");
        console.log("company_id is missing");
      }
    
      return res.status(400).json({
        error: "Missing required fields",
        details: `The following fields are missing: ${missingFields.join(", ")}`
      });
    }

    // Validate image data format
    if (typeof condition_image !== 'string' || !condition_image.startsWith('data:image')) {
      return res.status(400).json({ error: "Invalid image data format" });
    }

    let uniqueFilePath;
    try {
      // Extract and save the image
      const base64Data = condition_image.split(';base64,').pop();
      const buffer = Buffer.from(base64Data, 'base64');
      uniqueFilePath = await imageHandler.saveImage(buffer);
    } catch (imageError) {
      console.error("Error saving image:", imageError);
      return res.status(400).json({ error: "Failed to save image" });
    }

    // Create the location log
    const newLog = await location_objects_logs.create({
      qr_code_id,
      cleaning_agent_id,
      condition_image: uniqueFilePath,
      company_id,
      date: new Date()
    });

    return res.status(200).json({ success: true, message: "Location log added successfully", log: newLog });
  } catch (error) {
    console.error("Error in addLocationLog:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getLocationLogImage = async (req, res) => {
  const log_id = req.query.log_id;

  try {
    location_objects_logs
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

exports.deleteLocation = async (req, res) => {
  await location_objects
  .findAll({ where: { id: req.query.location_id } })
  .then(async (locationObject) => {
    await db.location_objects_histories.create({
      qr_code_id: locationObject[0].qr_code_id,
      location_name: locationObject[0].location_name,
      company_id: locationObject[0].company_id,
      preferred_cleaning_agent: locationObject[0].preferred_cleaning_agent,
    });
    await qr_codes.update(
      {
        is_active: false,
        is_removed: true,
      },
      {
        where: { id: locationObject[0].qr_code_id },
      }
    );
    location_objects.destroy({ where: { id: req.query.location_id } });
    res.send(true);
  });
  
};

exports.editLocationData = async (req, res) => {
  try {
    console.log("editLocationData route call");
    const { currentQrCode, location_name, preferred_cleaning_agents, imageData, company_id } = req.body;

    console.log("Extracted values:");
    console.log("currentQrCode:", currentQrCode);
    console.log("location_name:", location_name);
    console.log("preferred_cleaning_agents:", preferred_cleaning_agents);
    console.log("imageData:", imageData ? "Present" : "Not present");
    console.log("company_id:", company_id);

    if (!currentQrCode || !location_name || !preferred_cleaning_agents || !company_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let uniqueFilePath;
    if (imageData) {
      console.log("Processing image data");
      try {
        uniqueFilePath = await imageHandler.saveImage(imageData);
        console.log("Image saved successfully. Path:", uniqueFilePath);
      } catch (imageError) {
        console.error("Error saving image:", imageError);
        return res.status(400).json({ error: "Failed to save image." });
      }
    }

    console.log("Searching for cleaning agents");
    const foundAgents = await db.cleaning_agents.findAll({
      where: {
        agent_name: preferred_cleaning_agents,
        company_id: company_id
      }
    });
    console.log("Found agents:", foundAgents);

    console.log("Processing cleaning agents");
    const arr_cleaning_agents_ids = await Promise.all(
      preferred_cleaning_agents.map(async (agentName) => {
        let foundAgent = foundAgents.find(agent => agent.agent_name === agentName);
        if (!foundAgent) {
          foundAgent = await db.cleaning_agents.create({
            agent_name: agentName,
            company_id,
          });
        }
        return foundAgent.id;
      })
    );
    console.log("Processed cleaning agent IDs:", arr_cleaning_agents_ids);

    console.log("Searching for QR code:", currentQrCode);
    const foundQrCode = await qr_codes.findOne({
      where: { id: currentQrCode },
    });

    if (!foundQrCode) {
      console.log("QR code not found");
      return res.status(404).json({ error: "QR code not found" });
    }

    const updateData = {
      location_name,
      preferred_cleaning_agent: arr_cleaning_agents_ids.join(","),
      company_id,
    };

    if (uniqueFilePath) {
      updateData.preferred_condition_image = uniqueFilePath;
    }

    console.log("Updating location data:", updateData);
    const updateResult = await location_objects.update(updateData, {
      where: { qr_code_id: foundQrCode.id }
    });
    console.log("Update result:", updateResult);

    console.log("Location data updated successfully");
    return res.status(200).json({ success: true, message: "Location data updated successfully" });
  } catch (error) {
    console.error("Error in editLocationData:", error);
    console.error("Error stack:", error.stack);
    return res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

exports.getLocationLogs = async (req, res) => {
  const qr_code_id = req.query.qr_code_id;

  try {
    const locationLogs = await location_objects_logs.findAll({
      where: { qr_code_id: qr_code_id },
    });

    for (let i = 0; i < locationLogs.length; i++) {
      const cleaningIdArr = locationLogs[i].cleaning_agents.split(",");
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
          .findAll({ where: { id: locationLogs[i].user_id } })
          .then((users) => {
            locationLogs[i].user_id = users[0].name + " " + users[0].surname;
          })
      );

      await Promise.all(promises);

      locationLogs[i].cleaning_agents = cleaningIdStrArr.join(",");
    }

    res.send(locationLogs);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.getAllLocations = async (req, res) => {
  try {
    const company_id = req.query.company_id;

    if (!company_id) {
      return res.status(400).json({ error: "Company ID is required" });
    }

    const locations = await location_objects.findAll({
      where: { company_id }
    });

    const locationsWithDetails = await Promise.all(locations.map(async (location) => {
      // Fetch QR code
      const qrCode = await qr_codes.findOne({
        where: { id: location.qr_code_id },
        attributes: ['qr_code_id']
      });

      // Fetch cleaning agents
      const cleaningAgentIds = location.preferred_cleaning_agent.split(',');
      const cleaningAgentsData = await cleaningAgents.findAll({
        where: { id: cleaningAgentIds },
        attributes: ['agent_name']
      });

      return {
        ...location.toJSON(),
        qr_code_str: qrCode ? qrCode.qr_code_id : null,
        preferred_cleaning_agent: cleaningAgentsData.map(agent => agent.agent_name).join(',')
      };
    }));

    return res.status(200).json(locationsWithDetails);
  } catch (error) {
    console.error("Error in getAllLocations:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getLocationHistory = async (req, res) => {
  try {
    const locations = await db.location_objects_histories.findAll({
      where: { company_id: req.query.company_id },
    });

    for (let i = 0; i < locations.length; i++) {
      // Fetch QR code asynchronously and wait for the result
      const qrCode = await qr_codes.findOne({
        where: { id: locations[i].qr_code_id },
      });

      // Assign qr_code_str to location
      if (qrCode) {
        locations[i].dataValues.qr_code_str = qrCode.qr_code_id;
      }

      const cleaningAgentsStrArr = [];
      const cleaningAgents = locations[i].preferred_cleaning_agent.split(",");

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

      locations[i].preferred_cleaning_agent = cleaningAgentsStrArr.join(",");
    }

    res.send(locations);
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).send("Internal server error");
  }
};

exports.addLocationLog = async (req, res) => {
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

  location_objects_logs.create({
    qr_code_id: qr_code_id,
    user_id: userId,
    cleaning_agents: foundIds,
    condition_image: uniqueFilePath,
    company_id: req.body.company_id,
  });

  res.send(true);
};