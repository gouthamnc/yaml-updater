const core = require("@actions/core");
const glob = require('glob');
const path = require('path');
const updateImageInYAML = require('./image_yaml_updater');
const { exit } = require("process");

function getInputs() {
  const targetPath = core.getInput("target-path");
  const filePaths = core.getInput("file-paths");
  const changes = JSON.parse(core.getInput("changes"));
  return {
    targetPath, filePaths, changes
  };
}

function setOutputs(success) {
  core.setOutput("success", success);
  // to open a random branch ... for the automated pr
  core.setOutput("branch-suffix", Math.random().toString(36).substring(7));
}

// imageDataByKey = {
//     "service-name": {
//         "tag": "image-tag",
//         "registry": "image-registry",
//         "repository": "image-repository",
//     },
//  }

function updateYamls(filePaths, changes) {
  console.log("Updating YAML files");
  for (var filePath of filePaths) {
    console.log(`Updating file: ${filePath}`);
    updateImageInYAML(filePath, changes);
  }
}

async function main() {
  const inputs = getInputs();
  console.log(inputs);
  const yaml_root_dir = inputs.targetPath;

  var filePaths = inputs.filePaths;
  if (filePaths) {
    const filePathsArray = filePaths.split(',');
    actualFilePaths = filePathsArray.map((filePath) => path.join(yaml_root_dir, filePath));
  } else {
    console.log("No file paths provided");
    exit(1);
  }

  console.log("Data to be updated: " + JSON.stringify(inputs.changes));

  updateYamls(actualFilePaths, inputs.changes);
  setOutputs( true)
}

main();
