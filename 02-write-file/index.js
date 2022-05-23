const fs = require("fs");
const path = require("path");
const process = require("process");
const readline = require("readline");
const { stdin: input, stdout: output } = require("process");

const rl = readline.createInterface({ input, output });

const newFile = path.join(__dirname, "text.txt");

fs.writeFile(newFile, "", (err) => {
  if (err) {
    throw err;
  }
});

const text = () => {
  console.log("Enter text:");
};

text();

rl.on("line", (data) => {
  if (data.toLowerCase() === "exit") {
    process.exit();
  } else {
    text();
    fs.appendFile(newFile, `${data}\n`, (err) => {
      if (err) {
        throw err;
      }
    });
  }
});

process.on("exit", () => {
  console.log("Completion of the process.");
});
