const buildApp = require("./models/app.js");
const conf=require("./config");

const startApp =  () => {
  const appOption = {
    logger: true,
  }

  const app = buildApp(appOption);

  try {
    // await app.listen(conf.port, conf.host); //this format is not working
     app.listen(conf.port, conf.host);
    console.log("App is running on port:++ " + conf.port+' | '+conf.db);
  } catch (error) {
    throw error;
  }
};

startApp();


//curl -H "Content-Type:application/json" --data "{...your data}" http://localhost:3000/login

