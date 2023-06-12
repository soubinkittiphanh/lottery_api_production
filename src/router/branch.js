const Branch = require("../controllers/admin/branch");
const express = require('express')
const router = express.Router()
const {jwtApi} = require("../api")
router.use(jwtApi.validateToken)

router.post("/createbrc", Branch.createBranch)
router.put("/updatebrc", Branch.updateBranch)
router.get("/fetchbrc", Branch.getBranch)


    module.exports =  router;