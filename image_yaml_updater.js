const fs = require('fs');
const yaml = require('js-yaml');

function updateImageInYAML(filePath, updates) {
  const fileContents = fs.readFileSync(filePath, 'utf8');
  try {
    const yamlData = yaml.load(fileContents);
    console.log(`Loaded YAML file: ${yamlData}`)
    if (yamlData && typeof yamlData === 'object') {
      updateNestedImage(yamlData, updates);
      const updatedYAML = yaml.dump(yamlData);
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

function updateNestedImage(yamlData, updates) {
  Object, keys(updates).forEach((key) => {
    console.log(`Updating key: ${key}`);
    const path = key.split('.');
    console.log(`Path: ${path}`);
    const dataToUpdate = path.reduce((acc, key) => acc[key], yamlData);
    console.log(`Data to update: ${dataToUpdate}`);
    if (is_scanable(dataToUpdate)) {
      dataToUpdate = updates[key];
    }
  })
}

function is_scanable(yamlData) {
  return typeof yamlData === "object" && yamlData != null ? true : false;
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
