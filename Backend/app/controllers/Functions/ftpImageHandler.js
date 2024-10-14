const path = require("path");
const fs = require("fs");
const { Client } = require("basic-ftp");
const { Readable, Writable } = require("stream");

const ftpConfig = {
  host: "HOSTNAME",
  user: "USERNAME",
  password: "PASSWORD",
  port: 21, // Define the port number here
  secure: false, // or true if using FTPS
  remoteDir: "/kontrolix/images",
};

async function uploadToFTP(buffer, filename) {
  const client = new Client();
  const stream = new Readable();

  stream.push(buffer);
  stream.push(null);

  try {
    await client.access(ftpConfig);
    const remotePath = path
      .join(ftpConfig.remoteDir, filename)
      .replace(/\\/g, "/");
    await client.ensureDir(path.dirname(remotePath));
    await client.uploadFrom(stream, remotePath);
    console.log("Image uploaded successfully to:", remotePath);
    return remotePath;
  } catch (err) {
    console.error("Failed to upload image to FTP server:", err);
    throw err;
  } finally {
    client.close();
  }
}

function saveImage(imageData) {
  return new Promise((resolve, reject) => {
    if (imageData.length != 0) {
      const matches = imageData[0].match(/^data:(image\/\w+);base64,(.+)$/);

      if (!matches) {
        return reject("Invalid image data format");
      }

      const mimeType = matches[1];
      const base64Data = imageData[0].replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      const extension = mimeType.split("/")[1];
      console.log(extension);
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 1000);
      const filename = `image_${timestamp}_${random}.${extension}`;

      uploadToFTP(buffer, filename)
        .then((remotePath) => {
          resolve(remotePath);
        })
        .catch((err) => {
          reject(err);
        });
    } else {
      reject("No image data provided");
    }
  });
}

async function getImage(imagePath) {
  const client = new Client();
  const chunks = [];

  const writableStream = new Writable({
    write(chunk, encoding, callback) {
      chunks.push(chunk);
      callback();
    },
  });

  try {
    await client.access(ftpConfig);
    await client.downloadTo(writableStream, imagePath);
    return Buffer.concat(chunks);
  } catch (err) {
    console.error("Failed to read image from FTP server:", err);
    throw err;
  } finally {
    client.close();
  }
}

async function displayImageAsBase64(imagePath) {
  try {
    const imageData = await getImage(imagePath);
    const base64Image = `data:image/png;base64,${imageData.toString("base64")}`;
    return base64Image;
  } catch (err) {
    console.error("Error getting image:", err);
    throw err;
  }
}
module.exports = {
  saveImage,
  getImage,
  displayImageAsBase64,
};
// Example usage:
// saveImage(imageData, type, category, company_id)
//   .then((remotePath) => {
//     console.log("Image saved to FTP:", remotePath);
//   })
//   .catch((err) => {
//     console.error("Error saving image:", err);
//   });
