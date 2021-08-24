const userget=(req,reply)=>{
    reply.send("GET USER");
}
const usergetid=(req,reply)=>{
    reply.send("ID GET USER");
}
const userdelete=(req,reply)=>{
    reply.send("DELETE USER");
}
const usercreate=(req,reply)=>{
    reply.send("CREATE USER");
}

module.exports={
    userget,
    usergetid,
    userdelete,
    usercreate,
}