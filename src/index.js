const buildApp = require("./app.js");
const conf=require("./config");
const autoService = require("./controllers/admin/autoFunction")
const startApp = async () => {
  const appOption = {
    logger: true,
  }

  const app = await buildApp(appOption);
  app.listen(conf.port,()=>{
    console.log("Your app is runing  :"+conf.port+' | :'+conf.db.database);
    setInterval(autoService,60000)
  })
};

startApp();


//curl -H "Content-Type:application/json" --data "{...your data}" http://localhost:3000/login

