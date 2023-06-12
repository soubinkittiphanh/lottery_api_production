const ProductNeck = require("../controllers/admin/productNeck");
const express = require('express')
const router = express.Router()
const {jwtApi} = require("../api")
router.use(jwtApi.validateToken)

router.get("/getsalelimit", ProductNeck.getProductNeck)
router.put("/updatesalelim", ProductNeck.updateProductNeck)
router.put("/cancelsalelim", ProductNeck.cancelProductNeck)


    module.exports =  router;