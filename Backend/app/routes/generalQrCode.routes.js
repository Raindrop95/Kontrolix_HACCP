module.exports = (app) => {
  const qr_codes = require("../controllers/QrCode/qrCode.controller");

  var router = require("express").Router();

  router.get("/getQrCodeStatistic", qr_codes.getQrCodeStatistic);
  router.get("/getAllActiveQrCodes", qr_codes.getAllActiveQrCodes);
  router.get("/getQrCodeInfo", qr_codes.getQrCodeInfo);

  app.use("/api/general/qrcode", router);
};
