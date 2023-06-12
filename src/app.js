const express=require("express")
const cors=require("cors");
const router = require("./router/index")

const buildApp=async(option={})=>{
    const app=express();
    app.use(cors());
    app.use(express.json());
    // ******** Old router no /api  prefix *********//
    app.use("/api",router.commonRouter)
    app.use("/api",router.branchRouter)
    app.use("/api",router.groupRouter)
    app.use("/api",router.ismRouter)
    app.use("/api",router.memberRouter)
    app.use("/api",router.paymentRouter)
    app.use("/api",router.poolRouter)
    app.use("/api",router.reportRouter)
    app.use("/api",router.saleRouter)
    app.use("/api",router.userRouter)
    return app;
}
module.exports=buildApp;