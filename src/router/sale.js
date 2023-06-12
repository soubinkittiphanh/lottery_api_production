const Sale=require("../controllers/sale");
const express = require('express')
const router = express.Router()
const {jwtApi} = require("../api")
router.use(jwtApi.validateToken)

router.post("/sale", Sale.sale)
router.post("/cancel", Sale.reverse)


    module.exports =  router;