const core = require("@actions/core");
const glob = require('glob');
const path = require('path');
const updateImageInYAML = require('./image_yaml_updater');
const { exit } = require("process");

function getInputs() {
  const targetPath = core.getInput("target-path");
  const dispatchedPayload = core.getInput("dispatched-payload");
  return {
    targetPath,
    dispatchedPayload,
  };
}

function setOutputs(dispatchedPayload, success) {
  core.setOutput("success", success);
  core.setOutput("updated-services", Object.keys(dispatchedPayload.images).join(', '));
  core.setOutput("updated-by-commit", dispatchedPayload["commit-sha"]);
  core.setOutput("updated-by-repo", dispatchedPayload["repo"]);
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
  for (var filePath of filePaths) {
    updateImageInYAML(filePath, '', '');
  }
}

async function main() {
  const inputs = getInputs();
  const yaml_root_dir = inputs.targetPath;
  const dispatchedPayload = JSON.parse(inputs.dispatchedPayload);
  console.log(dispatchedPayload);

  var filePaths = dispatchedPayload["file-paths"];
  if (filePaths) {
    const filePathsArray = filePaths.split(',');
    actualFilePaths = filePathsArray.map((filePath) => path.join(yaml_root_dir, filePath));
  } else {
    console.log("No file paths provided");
    exit(1);
  }

  console.log("Data to be updated: " + JSON.stringify(dispatchedPayload.changes));

  updateYamls(filePaths, dispatchedPayload.changes);
  setOutputs(dispatchedPayload, true)
}

main();
