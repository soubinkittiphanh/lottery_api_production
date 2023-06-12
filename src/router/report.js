const Report=require("../controllers/report");
const express = require('express')
const router = express.Router()
const {jwtApi} = require("../api")
router.use(jwtApi.validateToken)
router.get("/salereport", Report.salerep)
router.get("/winreport", Report.winrep)
router.post("/bonuschk", Report.bonusrep)
router.get("/brcreport", Report.branchrep)
router.get("/topsale", Report.topSaleRep)


    module.exports =  router;