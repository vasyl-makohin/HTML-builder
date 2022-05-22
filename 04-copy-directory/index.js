const fs = require("fs");
const path = require("path");

const oldFiles = path.join(__dirname, "files");
const newFiles = path.join(__dirname, "files-copy");

fs.mkdir(newFiles, { recursive: true }, (err) => {
  if (err) {
    throw err;
  }

  fs.readdir(newFiles, (err, files) => {
    if (err) {
      throw err;
    }
    files.forEach((file) => {
      fs.unlink(path.join(newFiles, file), (err) => {
        if (err) {
          throw err;
        }
      });
    });

    fs.readdir(oldFiles, (err, files) => {
      if (err) {
        throw err;
      }
      files.forEach((file) => {
        fs.copyFile(
          path.join(oldFiles, file),
          path.join(newFiles, file),
          (err) => {
            if (err) {
              throw err;
            }
          }
        );
      });
    });
  });
});
