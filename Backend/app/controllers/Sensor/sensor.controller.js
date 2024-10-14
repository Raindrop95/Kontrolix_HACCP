const db = require("../../models");
const Op = db.Sequelize.Op;

const sensors = db.sensor_objects;
const sensor_readings = db.sensor_readings;

exports.activateSensor = (req, res) => {
  const mac_address = req.query.mac_address;
  const company_id = req.query.company_id;

  sensors
    .findAll({ where: { mac_address: mac_address } })
    .then((foundSensors) => {
      if (foundSensors.length == 1) {
        sensors.update(
          {
            company_id: company_id,
            is_activated: true,
            is_active: true,
          },
          { where: { mac_address: mac_address } }
        );
        res.status(200).send({ message: "Sensor activated!" });
      } else {
        res.status(500).send({ message: "Mac Address was not found!" });
      }
    });
};

exports.newSensorReading = (req, res) => {
  const temperature = req.query.temperature;
  const humidity = req.query.humidity;

  const mac_address = req.query.mac_address;

  sensors
    .findAll({ where: { mac_address: mac_address } })
    .then((foundSensors) => {
      if (foundSensors.length > 0) {
        if (
          foundSensors[0].is_activated == true &&
          foundSensors[0].is_active == true
        ) {
          sensor_readings.create({
            sensor_id: foundSensors[0].id,
            company_id: foundSensors[0].company_id,
            temperature: temperature,
            humidity: humidity,
          });
          res.status(200).send({ message: "New reading saved!" });
        } else {
          res.status(500).send({ message: "Sensor ungültig!" });
        }
      } else {
        res.status(500).send({ message: "Sensor ungültig!" });
      }
    });
};

exports.getLastReadings = (req, res) => {
  const company_id = req.query.company_id;

  sensors
    .findAll({ where: { company_id: company_id }, order: [["id", "ASC"]] }) // Order by sensor id in ascending order
    .then((foundSensors) => {
      console.log(foundSensors);
      if (foundSensors.length > 0) {
        // Create an array of promises to fetch the last 7 readings for each sensor
        const sensorReadingPromises = foundSensors.map((sensor) => {
          return sensor_readings.findAll({
            where: { sensor_id: sensor.id },
            order: [["createdAt", "DESC"]], // Order by createdAt column in descending order
            limit: 100, // Limit the number of results to the last 7 readings
          });
        });

        // Wait for all promises to resolve
        return Promise.all(sensorReadingPromises);
      } else {
        return [];
      }
    })
    .then((sensorReadings) => {
      // Send the resolved readings array
      res.send(sensorReadings);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ error: "An error occurred" });
    });
};

exports.getActiveSensors = (req, res) => {
  const company_id = req.query.company_id;

  sensors
    .findAll({ where: { company_id: company_id, is_active: true } })
    .then((activeSensors) => {
      if (activeSensors.length > 0) {
        const activeSensorIds = activeSensors.map((sensor) => sensor.sensor_id);
        res.status(200).send(activeSensorIds);
      } else {
        res.status(404).send({
          message: "No active sensors found for the given company ID.",
        });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ error: "An error occurred" });
    });
};

exports.getAllSensors = (req, res) => {
  const company_id = req.query.company_id;

  sensors
    .findAll({
      where: { company_id: company_id },
      order: [["id", "ASC"]],
    })
    .then((allSensors) => {
      if (allSensors.length > 0) {
        res.status(200).send(allSensors);
      } else {
        res
          .status(404)
          .send({ message: "No sensors found for the given company ID." });
      }
    })
    .catch((error) => {
      console.error(error);
      res
        .status(500)
        .send({ error: "An error occurred while fetching sensors" });
    });
};

exports.toggleSensor = (req, res) => {
  const { sensor_id, isActive } = req.body;

  if (sensor_id === undefined) {
    return res.status(400).send({ message: "Sensor ID is required." });
  }

  if (isActive === undefined) {
    return res.status(400).send({ message: "isActive status is required." });
  }

  sensors
    .findOne({ where: { sensor_id: sensor_id } })
    .then((sensor) => {
      if (!sensor) {
        return res.status(404).send({ message: "Sensor not found." });
      }

      return sensors.update(
        { is_active: isActive, is_activated: isActive },
        { where: { sensor_id: sensor_id } }
      );
    })
    .then((result) => {
      if (result[0] === 1) {
        res.status(200).send({
          message: `Sensor ${sensor_id} has been ${
            isActive ? "activated" : "deactivated"
          } and ${isActive ? "is activated" : "is deactivated"}.`,
        });
      } else {
        res.status(404).send({ message: "No changes were made." });
      }
    })
    .catch((error) => {
      console.error(error);
      res
        .status(500)
        .send({ error: "An error occurred while toggling the sensor" });
    });
};

exports.addSensor = (req, res) => {
  const { company_id, mac_address } = req.body;

  if (!company_id || !mac_address) {
    return res
      .status(400)
      .send({ message: "Company ID and MAC address are required." });
  }

  sensors
    .findOne({
      order: [["sensor_id", "DESC"]],
    })
    .then((latestSensor) => {
      const newSensorId = latestSensor ? latestSensor.sensor_id + 1 : 1;

      return sensors.create({
        company_id: company_id,
        mac_address: mac_address,
        is_active: true,
        is_activated: true,
        sensor_id: newSensorId,
      });
    })
    .then((newSensor) => {
      res.status(201).send({
        message: "New sensor added successfully.",
        sensor: {
          id: newSensor.id,
          sensor_id: newSensor.sensor_id,
          company_id: newSensor.company_id,
          mac_address: newSensor.mac_address,
          is_active: newSensor.is_active,
          is_activated: newSensor.is_activated,
        },
      });
    })
    .catch((error) => {
      console.error(error);
      res
        .status(500)
        .send({ error: "An error occurred while adding the new sensor" });
    });
};

exports.deleteSensor = (req, res) => {
  const sensorId = req.params.id;

  if (!sensorId) {
    return res.status(400).send({ message: "Sensor ID is required." });
  }

  sensors
    .destroy({
      where: { sensor_id: sensorId },
    })
    .then((result) => {
      if (result === 1) {
        res.status(200).send({
          message: `Sensor ${sensorId} has been deleted successfully.`,
        });
      } else {
        res.status(404).send({ message: "Sensor not found." });
      }
    })
    .catch((error) => {
      console.error(error);
      res
        .status(500)
        .send({ error: "An error occurred while deleting the sensor" });
    });
};
