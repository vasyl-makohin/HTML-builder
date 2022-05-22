const fs = require("fs");
const path = require("path");

const secretFolder = path.join(__dirname, "secret-folder");

fs.readdir(secretFolder, { withFileTypes: true }, (err, files) => {
  if (err) {
    throw err;
  }
  files.forEach((file) => {
    if (file.isFile()) {
      fs.stat(
        path.join(__dirname, `/secret-folder/${file.name}`),
        (err, weight) => {
          if (err) {
            throw err;
          }
          const extName = path.extname(file.name);
          const fileName = path.basename(file.name, extName);
          console.log(
            `${fileName} - ${extName.slice(1)} - ${weight.size / 1024}kb`
          );
        }
      );
    }
  });
});
