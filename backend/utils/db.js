const fs = require('fs');
const path = require('path');

const LOANS_FILE = path.join(__dirname, '..', 'data', 'loans.json');
const TEMPLATES_FILE = path.join(__dirname, '..', 'data', 'templates.json');

function readDataFile(filePath, defaultVal = []) {
  try {
    if (!fs.existsSync(filePath)) {
      return defaultVal;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error(`Error reading file ${filePath}:`, err);
    return defaultVal;
  }
}

function writeDataFile(filePath, data) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`Error writing file ${filePath}:`, err);
    return false;
  }
}

module.exports = {
  LOANS_FILE,
  TEMPLATES_FILE,
  readDataFile,
  writeDataFile
};
