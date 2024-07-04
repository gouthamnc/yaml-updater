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
      updateNestedImage(yamlData, updates);
      console.log(`Updated YAML data: ${yamlData}`);
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

function updateNestedImage(yamlData, updates) {
  Object.keys(updates).forEach((key) => {
    console.log(`Updating key: ${key}`);
    const path = key.split('.');
    console.log(`Path: ${path}`);
    let dataToUpdate = path.reduce((acc, key) => acc[key], yamlData);
    console.log(`Data to update: ${dataToUpdate}`);
    if (is_scanable(dataToUpdate)) {
      dataToUpdate = updates[key];
    }
  })
}

function is_scanable(yamlData) {
  return typeof yamlData === "object" && yamlData != null;
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
