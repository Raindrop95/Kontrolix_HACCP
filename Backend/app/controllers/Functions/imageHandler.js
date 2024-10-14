const fs = require("fs");
const path = require("path");

function saveImage(imageData, type, category, company_id) {
  return new Promise((resolve, reject) => {
    if (imageData.length != 0) {
      const matches = imageData[0].match(/^data:(image\/\w+);base64,(.+)$/);

      const mimeType = matches[1];
      const base64Data = imageData[0].replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      const extension = mimeType.split("/")[1];
      console.log(extension);
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 1000);
      const filename = `image_${timestamp}_${random}.${extension}`;
      const uploadPath = path.join(
        "./app/UserData/Images/",
        company_id.toString(),
        category,
        type,
        filename
      );

      const generateUniqueFilename = (filePath) => {
        if (fs.existsSync(filePath)) {
          const newRandom = Math.floor(Math.random() * 1000);
          const newFilename = `image_${timestamp}_${newRandom}.png`;
          return path.join(
            "./app/filesys/company/1/category/qrcode/food/",
            company_id.toString(),
            category,
            type,
            newFilename
          );
        }
        return filePath;
      };

      const uniqueFilePath = generateUniqueFilename(uploadPath);

      fs.mkdirSync(path.dirname(uniqueFilePath), { recursive: true });

      fs.writeFile(uniqueFilePath, buffer, (err) => {
        if (err) {
          console.error("Failed to save image:", err);
          reject(err);
        } else {
          console.log("Image saved successfully at:", uniqueFilePath);
          resolve(uniqueFilePath);
        }
      });
    } else {
      reject("No image data provided");
    }
  });
}

function getImage(imagePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(imagePath, (err, data) => {
      if (err) {
        console.error("Failed to read image:", err);
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

module.exports = {
  saveImage,
  getImage,
};
