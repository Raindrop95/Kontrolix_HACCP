const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = __dirname + "/app/views/";
const app = express();

var history = require("connect-history-api-fallback");

app.use(express.static(path));

var corsOptions = {
  origin: "http://localhost:5173", //http://{hostip}:{PORT}/  for development use localhost as hostip
};

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(history());

const db = require("./app/models");

db.sequelize.sync();

app.get("/", function (req, res) {
  res.sendFile(path + "index.html");
});

require("./app/routes/user.routes.js")(app);
require("./app/routes/auth.routes.js")(app);

require("./app/routes/food.routes.js")(app);
require("./app/routes/workspace.routes.js")(app);
require("./app/routes/location.routes.js")(app);

require("./app/routes/generalQrCode.routes.js")(app);
require("./app/routes/history.routes.js")(app);
require("./app/routes/sensor.routes.js")(app);
require("./app/routes/user_mgnt.routes.js")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080; //development Port 8080
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
