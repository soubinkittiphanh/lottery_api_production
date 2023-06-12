
const Ism = require("../controllers/admin/ism");
const express = require('express')
const router = express.Router()
const {jwtApi} = require("../api")
router.use(jwtApi.validateToken)
router.get("/fetchism", Ism.getISM)
router.get("/ismref", Ism.genISMID)
router.post("/createism", Ism.createISM)
router.put("/updateism", Ism.updateISM)
router.get("/getism_ref", Ism.getISMREF)


    module.exports =  router;