const fs = require("fs");
const path = require("path");

const newDirectory = path.join(__dirname, "project-dist");
const styles = path.join(__dirname, "styles");
const pageStyles = path.join(__dirname, "project-dist/style.css");
const assets = path.join(__dirname, "assets");
const pageAssets = path.join(__dirname, "project-dist", "assets");
const template = path.join(__dirname, "template.html");
const indexHtml = path.join(__dirname, "project-dist/index.html");
const components = path.join(__dirname, "components");

fs.mkdir(newDirectory, { recursive: true }, (err) => {
  if (err) {
    throw err;
  }
});

fs.readdir(styles, (err, files) => {
  if (err) {
    throw err;
  }

  fs.writeFile(pageStyles, "", (err) => {
    if (err) {
      throw err;
    }
  });
  files.forEach((file) => {
    const extName = path.extname(file);
    if (extName === ".css") {
      const readFile = fs.createReadStream(`${styles}/${file}`);
      readFile.on("data", (data) => {
        fs.appendFile(pageStyles, data, (err) => {
          if (err) {
            throw err;
          }
        });
      });
    }
  });
});

const rs = fs.createReadStream(template);

fs.writeFile(indexHtml, "", (err) => {
  if (err) {
    throw err;
  }
});
rs.on("data", (data) => {
  let mass = data.toString().split("\n");
  let elem = 0;
  let el = 0;
  for (let i = 0; i < mass.length; i++) {
    if (mass[i].split("{{").length > 1) {
      elem++;
    }
  }
  for (let i = 0; i < mass.length; i++) {
    let componentName = "";
    if (mass[i].split("{{").length > 1) {
      componentName = mass[i].split("{{")[1].split("}}")[0];
    }
    fs.readdir(components, { withFileTypes: true }, (err, files) => {
      files.forEach((file) => {
        const extName = path.extname(file.name);
        const fileName = path.basename(file.name, extName);
        const component = fs.createReadStream(path.join(components, file.name));
        component.on("data", (data) => {
          if (componentName === fileName) {
            mass.splice(i, 1, data.toString());
            el++;
          }
          if (
            i === mass.length - 1 &&
            el === elem &&
            files[files.length - 1].name === file.name
          ) {
            fs.appendFile(indexHtml, mass.join("\n"), (err) => {
              if (err) {
                throw err;
              }
            });
          }
        });
      });
    });
  }
});

fs.mkdir(pageAssets, { recursive: true }, (err) => {
  if (err) {
    throw err;
  }

  fs.readdir(pageAssets, { withFileTypes: true }, (err, files) => {
    if (err) {
      throw err;
    }
    files.forEach((file) => {
      fs.readdir(path.join(pageAssets, file.name), (err, files) => {
        files.forEach((f) => {
          fs.unlink(path.join(pageAssets, file.name, f), (err) => {
            if (err) {
              throw err;
            }
          });
        });
      });
    });

    fs.readdir(assets, { withFileTypes: true }, (err, files) => {
      if (err) {
        throw err;
      }
      files.forEach((file) => {
        if (file.isFile()) {
          fs.copyFile(
            path.join(assets, file),
            path.join(pageAssets, file),
            (err) => {
              if (err) {
                throw err;
              }
            }
          );
        } else {
          fs.mkdir(
            path.join(pageAssets, file.name),
            { recursive: true },
            (err) => {
              if (err) {
                throw err;
              }
              fs.readdir(path.join(assets, file.name), (err, files) => {
                files.forEach((f) => {
                  fs.copyFile(
                    path.join(assets, file.name, f),
                    path.join(pageAssets, file.name, f),
                    (err) => {
                      if (err) {
                        throw err;
                      }
                    }
                  );
                });
              });
            }
          );
        }
      });
    });
  });
});
