const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");

////////////////////////////////////////////////////////////////////////

const sequelize = new Sequelize("DBNAME", "DBUSER", "DBPASSWORD", {
  host: "DBHOST",
  dialect: "postgres",
  port: PORT, // Default port, adjust if needed
  logging: true, // Optional: disable logging; default: console.log
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: true, // Enforce strict SSL validation
    },
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

////////////////////////////////////////////////////////////////////////

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model.js")(sequelize, Sequelize);
db.role = require("./role.model.js")(sequelize, Sequelize);
db.food_objects = require("./FoodObjects/foodobjects.model.js")(
  sequelize,
  Sequelize
);
db.food_objects_history = require("./FoodObjects/foodobjectshistory.model.js")(
  sequelize,
  Sequelize
);
db.product_names = require("./FoodObjects/productnames.model.js")(
  sequelize,
  Sequelize
);
db.qr_codes = require("./QrCodes/qrcodes.model.js")(sequelize, Sequelize);
db.cleaning_agents = require("./cleaning_agents.model.js")(
  sequelize,
  Sequelize
);

// db.qr_codes_fixed = require("./QrCodes/qrcodes_fixed.model.js")(
//   sequelize,
//   Sequelize
// );
db.companies = require("./Customers/companies.model.js")(sequelize, Sequelize);
db.food_objects_logs = require("./FoodObjects/foodobjectslogs.model.js")(
  sequelize,
  Sequelize
);
db.workspace_objects = require("./WorkspaceObjects/workspaceobjects.model.js")(
  sequelize,
  Sequelize
);

db.workspace_objects_logs =
  require("./WorkspaceObjects/workspaceobjectlogs.model.js")(
    sequelize,
    Sequelize
  );

db.workspace_objects_histories =
  require("./WorkspaceObjects/workspaceobjecthistory.model.js")(
    sequelize,
    Sequelize
  );

db.oilchange_objects = require("./OilChangeObjects/oilchangeobjects.model.js")(
  sequelize,
  Sequelize
);

db.location_objects = require("./LocationObjects/locationobjects.model.js")(
  sequelize,
  Sequelize
);

db.location_objects_logs =
  require("./LocationObjects/locationobjectlogs.model.js")(
    sequelize,
    Sequelize
  );

db.location_objects_histories =
  require("./LocationObjects/locationobjecthistory.model.js")(
    sequelize,
    Sequelize
  );

db.sensor_objects = require("./Sensors/sensor_objects.model.js")(
  sequelize,
  Sequelize
);
db.sensor_readings = require("./Sensors/sensor_readings.model.js")(
  sequelize,
  Sequelize
);

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId",
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId",
});

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
