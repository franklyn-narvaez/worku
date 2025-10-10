import { defineConfig } from "cypress";

export default defineConfig({
  env: {
    baseUrl: 'http://localhost:5173',
    login: 'http://localhost:5173/auth/login',
  },
  e2e: {
    setupNodeEvents(on, config) {
     	config.baseUrl = config.env.baseUrl;
			config.viewportWidth = 1920;
			config.viewportHeight = 1080;

			return config
    },
  },

  // enable cypress studio
  experimentalStudio: true,
  watchForFileChanges: true,
});
