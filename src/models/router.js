const User = require("../controllers/user");
const Init = require("../controllers/init");
const Ism = require("../controllers/admin/ism");
const Group = require("../controllers/admin/group");
const Branch = require("../controllers/admin/branch");
const Member = require("../controllers/admin/member");
const ProductNeck = require("../controllers/admin/productNeck");
const PayRate = require("../controllers/admin/payRate");
const Report=require("../controllers/report");
const Sale=require("../controllers/sale");
const user = async (app) => {
  app.get("/user", User.userget);
  app.get("/getuserid", User.usergetid);
  app.get("/deleteuser", User.userdelete);
  app.get("/createuser", User.usercreate);
};
const init = async (app) => {
  app.get("/", Init.home);
  await app.get("/dbuser", Init.dbuser);
  await app.post("/auth", Init.auth);
};
const ism = async (app) => {
  await app.get("/fetchism", Ism.getISM);
  await app.get("/ismref", Ism.genISMID);
  await app.post("/createism", Ism.createISM);
  await app.put("/updateism", Ism.updateISM);
  await app.get("/getism_ref", Ism.getISMREF);
};
const group = async (app) => {
  await app.post("/creategroup", Group.createGroup);
  await app.put("/updategroup", Group.updateGroup);
  await app.get("/fetchGroup", Group.getGroup);
  await app.get("/fetchGroupCode", Group.getGroupById);
};
const branch = async (app) => {
  await app.post("/createbrc", Branch.createBranch);
  await app.put("/updatebrc", Branch.updateBranch);
  await app.get("/fetchbrc", Branch.getBranch);
};
const member = async (app) => {
  await app.post("/createuser", Member.createMember);
  await app.put("/updateuser", Member.updateMember);
  await app.put("/resetpass", Member.resetPassword);
  await app.get("/gen_uid", Member.genId);
  await app.get("/fetchuser", Member.getMember);
  await app.get("/fetchuserid", Member.getMemberById);
};
const productNeck = async (app) => {
  await app.get("/getsalelimit", ProductNeck.getProductNeck);
  await app.put("/updatesalelim", ProductNeck.updateProductNeck);
  await app.put("/cancelsalelim", ProductNeck.cancelProductNeck);
};
const payRate = async (app) => {
  await app.get("/getpayrate", PayRate.getPayRate);
  await app.put("/updatepayrate", PayRate.updatePayRate);
};
const report = async (app) => {
  await app.get("/salereport", Report.salerep);
  await app.get("/winreport", Report.winrep);
  await app.post("/bonuschk", Report.bonusrep);
  await app.get("/brcreport", Report.branchrep);
  await app.get("/topsale", Report.topSaleRep);
};
const sale = async (app) => {
  await app.post("/sale", Sale.sale);
  await app.post("/cancel", Sale.reverse);
};

module.exports = {
  user,
  init,
  ism,
  group,
  branch,
  member,
  productNeck,
  payRate,
  report,
  sale,
};
