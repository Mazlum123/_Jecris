const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'index.html',
  'assets',
];

const validateBuild = () => {
  const distPath = path.join(__dirname, '../dist');

  for (const file of requiredFiles) {
    const filePath = path.join(distPath, file);
    if (!fs.existsSync(filePath)) {
      console.error(`Missing required file: ${file}`);
      process.exit(1);
    }
  }

  console.log('Build validation successful');
};

validateBuild();