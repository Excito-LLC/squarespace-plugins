const fs = require('fs');
const path = require('path');
const sass = require('sass');

const srcDir = './src';
const pluginsDir = './plugins';

// Get a list of subdirectories in the srcDir
const pluginDirectories = fs.readdirSync(srcDir).filter(item => fs.statSync(path.join(srcDir, item)).isDirectory());

// Compile Sass for each plugin
pluginDirectories.forEach(pluginName => {
  const pluginSrcDir = path.join(srcDir, pluginName);
  const pluginOutputDir = path.join(pluginsDir, pluginName);

  // Check if there are any .scss files in the plugin's src directory
  const scssFiles = fs.readdirSync(pluginSrcDir).filter(file => path.extname(file) === '.scss');

  if (scssFiles.length === 0) {
    // No SCSS files found, so skip this plugin
    // console.log(`No SCSS files found for plugin: ${pluginName}`);
  } else {
    // Compile each SCSS file in the plugin's src directory
    scssFiles.forEach(scssFile => {
      const scssFilePath = path.join(pluginSrcDir, scssFile);
      const cssFileName = path.basename(scssFile, '.scss') + '.css';

      // Compile the SCSS file
      const result = sass.renderSync({
        file: scssFilePath,
      });

      // Ensure the output directory exists
      if (!fs.existsSync(pluginOutputDir)) {
        fs.mkdirSync(pluginOutputDir, { recursive: true });
      }

      // Write the compiled CSS to the corresponding plugin's folder
      fs.writeFileSync(path.join(pluginOutputDir, cssFileName), result.css);
    });
  }
});
