const express=require("express")
const Router=require("./router");
const cors=require("cors");


const buildApp=async(option={})=>{
    const app=express();
    app.use(cors());
    app.use(express.json());
    
    Router.user(app);
    Router.init(app);
    Router.ism(app);
    Router.group(app);
    Router.branch(app);
    Router.member(app);
    Router.productNeck(app);
    Router.payRate(app);
    Router.report(app);
    Router.sale(app);
    return app;
}
module.exports=buildApp;