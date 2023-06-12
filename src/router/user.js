
const User = require("../controllers/user");
const express = require('express')
const router = express.Router()
const {jwtApi} = require("../api")
router.use(jwtApi.validateToken)
router
    .get("/user", User.userget)
router
    .get("/getuserid", User.usergetid)
router
    .get("/deleteuser", User.userdelete)
router
    .get("/createuser", User.usercreate)


module.exports = router;