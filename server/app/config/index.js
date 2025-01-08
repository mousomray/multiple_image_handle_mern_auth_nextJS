module.exports = {
  // Define application configuration
  appRoot: {
    env: process.env.NODE_ENV || "development",
    isProd: process.env.NODE_ENV === "production",
    host: process.env.HOST || "localhost",
    port: process.env.PORT || 3004,
    appName: process.env.APP_NAME || "second_test",
    getApiFolderName: process.env.API_FOLDER_NAME || "api",
    getAuthFolderName: process.env.AUTH_FOLDER_NAME || "auth",
  },
};