const db=require("../../config/dbconn");

const createBranch=async(req, res) => {
    const abbr = req.body.abbr;
    const name = req.body.name;
    const desc = req.body.desc;
    const comm = req.body.commrate;
    console.log("::::::::::::::CREATE BRC::::::::::::::");
    console.log("DATA abbr:" + abbr + " name:" + name + " desc:" + desc);
    const sql =
      "INSERT IGNORE `branch`(`co_code`, `co_name`, `co_gname`,`co_comm`) VALUES (?,?,?,?)";
  
    console.log("::::::::::::::LICENSE CREATE BRC::::::::::::::");
    await db.query(
      "SELECT app_max,COUNT(co_code) AS co_code FROM tbl_license, branch WHERE app_name='branch'",
      (err, result) => {
        if (err) {
          res.send("ເກີດຂໍ້ຜິດພາດການກວດສອບ (MAXIMUM)");
        } else {
          console.log(
            "RESULTS BRANCH:" +
              result[0]["co_code"] +
              " MAX: " +
              result[0]["app_max"]
          );
          if (result[0]["co_code"] < result[0]["app_max"]) {
            console.log("::::::::::::::LICENSE CREATE BRC ALLOW::::::::::::::");
  
             db.query(
              `SELECT co_code FROM branch WHERE co_code='${abbr}'`,
              (err, result) => {
                if (err) {
                  res.send("ເກີດຂໍ້ຜິດພາດທາງເຊີເວີ: " + err);
                } else {
                  if (result.length >= 1) {
                    res.send(
                      "ເກີດຂໍ້ຜິດດພາດ ລະຫັດສາຂາຊ້ຳກັນ: " + abbr + " ມີສາຂານີ້ແລ້ວ"
                    );
                  } else {
                     db.query(sql, [abbr, name, desc,comm], (err, reslt) => {
                      if (err) {
                        console.log(err);
                        res.send("ເກີດຂໍ້ຜິດພາດ: " + err);
                      } else {
                        console.log("SUCCEED:" + reslt);
                        res.send("ດຳເນີນການສຳເລັດ");
                      }
                    });
                  }
                }
              }
            );
          } else {
            console.log(
              "::::::::::::::LICENSE CREATE BRC REACH MAXIMUM::::::::::::::"
            );
            res.send("ດຳເນີນການບໍ່ສຳເລັດ ສາຂາເກີນຂະຫນາດຂອງເຊີເວີ");
          }
        }
      }
    );
  };
  const updateBranch=async(req, res) => {
    const id = req.body.id;
    const abbr = req.body.abbr;
    const name = req.body.name;
    const desc = req.body.desc;
    const comm = req.body.commrate;
    console.log("::::::::::::::UPDATE BRC::::::::::::::");
    console.log(
      "DATA abbr:" + abbr + " name:" + name + " desc:" + desc + " " + id+' com:'+comm
    );
    const sql =
      "UPDATE `branch` SET `co_code`=?, `co_name`=?, `co_gname`=?,`co_comm`=? WHERE `id`=? ";
    await db.query(sql, [abbr, name, desc,comm, id], (err, reslt) => {
      if (err) {
        res.send("ເກີດຂໍ້ຜິດພາດ: " + err);
      } else {
        console.log("SUCCEED:" + reslt);
        res.send("ດຳເນີນການສຳເລັດ");
      }
    });
  };
  const getBranch=async(req, res) => {
    console.log("::::::::::::::FETCH BRC::::::::::::::");
    const sql = "SELECT * FROM branch";
    await db.query(sql, (err, reslt) => {
      if (err) {
        res.send("ເກີດຂໍ້ຜິດພາດ: " + err);
      } else {
        console.log("SUCCEED:" + reslt);
        res.send(reslt);
      }
    });
  };

  module.exports={
      createBranch,
      updateBranch,
      getBranch,
  }