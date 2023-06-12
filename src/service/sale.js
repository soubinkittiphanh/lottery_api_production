const dbAsync = require("../config/dbconnPromise");


const takeUserBranch = async(userId)=>{
    const sqlCmd = `SELECT brc_code FROM member WHERE mem_id = '${userId}'`;
    let branchId =null
    try {
        const [rows,fields] = await dbAsync.query(sqlCmd)
        branchId = rows[0]["brc_code"];
        return branchId
    } catch (error) {
        return  branchId;
    }
}

module.exports = {
    takeUserBranch,
}