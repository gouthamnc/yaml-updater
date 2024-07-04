const fs = require('fs');
const yaml = require('js-yaml');

function updateImageInYAML(filePath, updates) {
  console.log(`Updating YAML file: ${filePath}`);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  console.log(`Read YAML file: ${fileContents}`);
  try {
    const yamlData = yaml.load(fileContents);
    console.log(`Loaded YAML file: ${yamlData}`)
    if (yamlData && typeof yamlData === 'object') {
      updateNestedObject(yamlData, updates);
      console.log(`Updated YAML data: `, yamlData);
      const updatedYAML = yaml.dump(yamlData);
      console.log(`Updated YAML: ${updatedYAML}`);
      fs.writeFileSync(filePath, updatedYAML, 'utf8');
      console.log(`Updated YAML file: ${filePath}`);
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
  console.log('Updated nested object:', originalJson);
}


module.exports = updateImageInYAML;

// Example usage
// const filePath = 'test-yamls/values.yaml';
// const dispatchedKey = 'metrics';
// const dispatchedEvent = {
//   registry: 'newfoo',
//   repository: 'repository',
//   tag: 'v2',
// };

// updateImageInYAML(filePath, dispatchedKey, dispatchedEvent);
