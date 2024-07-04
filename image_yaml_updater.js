const fs = require('fs');
const yaml = require('js-yaml');

function updateDataInYaml(filePath, updates) {
  const fileContents = fs.readFileSync(filePath, 'utf8');
  try {
    const yamlData = yaml.load(fileContents);
    if (yamlData && typeof yamlData === 'object') {
      updateNestedObject(yamlData, updates);
      const updatedYAML = yaml.dump(yamlData);
      fs.writeFileSync(filePath, updatedYAML, 'utf8');
    } else {
      console.error('Invalid YAML structure. Root should be an object.');
    }
  } catch (error) {
    console.error(error);
    console.error(`Error parsing YAML file: ${filePath}`);
  }
}

function updateNestedObject(originalJson, updateJson) {
  for (const keyPath in updateJson) {
    const keys = keyPath.split('.');
    let nestedObject = originalJson;

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      if (i === keys.length - 1) {
        nestedObject[key] = updateJson[keyPath]; // Update the value when reaching the final key in the path
      } else {
        if (!nestedObject[key]) {
          nestedObject[key] = {}; // Create a new nested object if the key does not exist
        }
        nestedObject = nestedObject[key]; // Traverse deeper into the nested structure
      }
    }
  }
}


module.exports = updateDataInYaml;

// Example usage
// const filePath = 'test-yamls/values.yaml';
// const dispatchedKey = 'metrics';
// const dispatchedEvent = {
//   registry: 'newfoo',
//   repository: 'repository',
//   tag: 'v2',
// };

// updateImageInYAML(filePath, dispatchedKey, dispatchedEvent);
