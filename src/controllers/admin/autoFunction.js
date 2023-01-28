const db = require("../../config/dbconn");
closeService = () => {
    const sqlCom = `UPDATE installment SET ism_active=0 WHERE ism_ref=(SELECT MAX(ism_ref) FROM installment)`
    db.query(sqlCom,(er,result)=>{
        if(er){
            console.log("SQL Error: ",er.message);
        }else{
            console.log("Transaction complete", result);
        }
    })
    console.log("Closing service");
}

openSevice = () => {
    console.log("Opening service");
    // Get new ISM refference
    db.query(
        "SELECT MAX(`ism_ref`) as cur_ref FROM `installment` HAVING MAX(`ism_ref`) IS NOT null",
        (er, result) => {
            let numRows = result.length;
            console.log("Row: " + numRows);
            if (er) {
                res.send(er);
            } else if (result) {
                if (numRows < 1) {
                    createISM("10000")
                } else {
                    const next_ref = result[0].cur_ref + 1;
                    createISM(next_ref);
                }
                console.log("//::::::::::::::ກວດສອບງວດ::::::::::::::");
            }
        }
    );
}

createISM = (i_ref) => {
    console.log("//::::::::::::::AUTO CREATE ISM::::::::::::::");
    let sqlDatetime = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60 * 1000).toJSON().slice(0, 19).replace('T', ' ');
    console.log("SQL", sqlDatetime);
    let sqlDate = sqlDatetime.split(" ")[0]
    let i_res = ""
    let i_active = 1;
    db.query(
        "INSERT INTO installment(ism_ref, ism_date, ism_result, ism_active) values(?,?,?,?)",
        [i_ref, sqlDate, i_res, i_active],
        (err, result) => {
            if (err) {
                console.log("AUTO ISM CREATE FAIL ", err);
            } else {
                console.log("AUTO ISM CREATE SUCCEED ", result);
            }
        }
    );
}

doSomething = () => {
    let dateObj = new Date(Date.now()).toLocaleString();
    let day = new Date
    let timeObj = dateObj.split(",")[1]
    let hh = timeObj.split(":")[0]
    let mm = timeObj.split(":")[1]
    let isEvening = timeObj.split(" ")[2] == "PM"
    console.log("Worker is runing", dateObj, day.getDay());
    if (hh == 8 && mm == 10 && isEvening) closeService();
    if ((day.getDay() == 1 || day.getDay() == 3 || day.getDay() == 5) && (!isEvening && hh == 12 && mm == 01)) openSevice();
}
module.exports =  doSomething 