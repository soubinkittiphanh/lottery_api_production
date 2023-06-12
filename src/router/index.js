const memberRouter = require("./member")
const branchRouter = require("./branch")
const commonRouter = require("./comon")
const groupRouter = require("./group")
const ismRouter = require("./ism")
const paymentRouter =  require("./paymentRate")
const poolRouter = require("./pool")
const reportRouter = require("./report")
const saleRouter = require("./sale")
const userRouter = require("./user")
module.exports = {
    memberRouter,
    branchRouter,
    commonRouter,
    paymentRouter,
    groupRouter,
    ismRouter,
    poolRouter,
    reportRouter,
    saleRouter,
    userRouter,
}