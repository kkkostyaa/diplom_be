const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    //BaseUrl: '',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
