
const Group = require("../controllers/admin/group");
const express = require('express')
const router = express.Router()
const {jwtApi} = require("../api")
router.use(jwtApi.validateToken)

router.post("/creategroup", Group.createGroup)
router.put("/updategroup", Group.updateGroup)
router.get("/fetchGroup", Group.getGroup)
router.get("/fetchGroupCode", Group.getGroupById)


    module.exports =  router;