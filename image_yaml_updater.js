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
    console.log('Current key path:', keyPath);
    const keys = keyPath.split('.');
    console.log('Split keys:', keys);
    let nestedObject = originalJson;

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      console.log('Current key:', key);

      if (!nestedObject.hasOwnProperty(key)) {
        console.log('Key not found:', key);
        if (i === keys.length - 1) {
          console.log('Adding missing key:', key);
          nestedObject[key] = updateJson[keyPath]; // Add the missing key with the updated value
        } else {
          console.log('Creating new nested object for key:', key);
          nestedObject[key] = {}; // Create a new nested object
        }
      }

      if (i !== keys.length - 1) {
        console.log('Traversing deeper into key:', key);
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
