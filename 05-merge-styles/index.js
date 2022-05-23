const fs = require("fs");
const path = require("path");

const styles = path.join(__dirname, "styles");
const bundle = path.join(__dirname, "project-dist/bundle.css");

fs.readdir(styles, (err, files) => {
  if (err) {
    throw err;
  }

  fs.writeFile(bundle, "", (err) => {
    if (err) {
      throw err;
    }
  });
  files.forEach((file) => {
    const extName = path.extname(file);
    if (extName === ".css") {
      const readFile = fs.createReadStream(`${styles}/${file}`);
      readFile.on("data", (data) => {
        fs.appendFile(bundle, data, (err) => {
          if (err) {
            throw err;
          }
        });
      });
    }
  });
});
