const { defineConfig } = require('cypress');
const CustomReporter = require('./custom-reporter.js'); // Adjust the path as needed
const fs = require("fs");
const path = require("path");

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  viewportWidth: 1400,
  viewportHeight: 800,
  reporterOptions: {
    charts: true,
    reportPageTitle: 'Yaksha Automation Report',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,    
  },
  e2e: {

    baseUrl: 'https://yakshahrm.makemylabs.in/orangehrm-5.7/web/index.php',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.js',
    downloadsFolder: 'cypress/downloads',

    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);

      const reporter = new CustomReporter();

      on('after:spec', async (spec, results) => {
        if (results && results.tests) {
          for (const test of results.tests) {
            const status = test.state; // 'passed', 'failed', or 'skipped'
            const error = test.displayError || '';
            await reporter.logTestResult(test, status, error);
          }
        }
      });

      on('after:run', async () => {
        await reporter.onEnd();
      });

      on('task', {
        updateFixture(data) {
          const filePath = path.resolve('cypress/fixtures/AddSkillData.json');
          fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
          return null;
        },

        cleanDownloads() {
          const folder = config.downloadsFolder;
          if (fs.existsSync(folder)) {
            fs.readdirSync(folder).forEach((file) => {
              fs.unlinkSync(path.join(folder, file));
            });
          }
          return null;
        },

        getLatestDownloadedFile() {
          const folder = config.downloadsFolder;
          const files = fs.readdirSync(folder);
          if (files.length === 0) {
            throw new Error("No files found in downloads folder.");
          }

          const sortedFiles = files
            .map((file) => ({
              name: file,
              time: fs.statSync(path.join(folder, file)).mtime.getTime(),
            }))
            .sort((a, b) => b.time - a.time);

          return sortedFiles[0].name;
        },

        verifyDownloadedFileExists(fileName) {
          const filePath = path.join(config.downloadsFolder, fileName);
          return fs.existsSync(filePath);
        },
      });

      return config;
    },
    defaultCommandTimeout: 4000,
  },
});