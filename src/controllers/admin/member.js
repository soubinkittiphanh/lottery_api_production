const db = require("../../config/dbconn");
const bcrypt=require("../../../custom-bcrypt");
const createMember = async (req, res) => {
  console.log("::::::::::::::create user::::::::::::::");
  const name = req.body.name;
  const lname = req.body.lname;
  const logid = req.body.logid;
  const logpass = bcrypt.hash(req.body.logpass);
  const vill = req.body.vill;
  const dist = req.body.dist;
  const pro = req.body.pro;
  const active = req.body.active;
  const admin = req.body.admin;
  const rec = req.body.mem_rec;
  const tel = req.body.mem_tel;
  const com_sale = req.body.com_sale;
  const com_win = req.body.com_win;
  const group_code = req.body.group_code;
  const brc_code = req.body.brc_code;
  console.log(rec);
  console.log(tel);

  console.log("::::::::::::::LICENSE CREATE USER::::::::::::::");
  await db.query(
    "SELECT app_max,COUNT(mem_id) AS mem_id FROM tbl_license, member WHERE app_name='member'",
    (err, result) => {
      if (err) {
        res.send("ເກີດຂໍ້ຜິດພາດການກວດສອບ (MAXIMUM)");
      } else {
        console.log(
          "RESULTS BRANCH:" +
            result[0]["mem_id"] +
            " MAX: " +
            result[0]["app_max"]
        );
        if (result[0]["mem_id"] < result[0]["app_max"]) {
          console.log("::::::::::::::LICENSE CREATE USER ALLOW::::::::::::::");

           db.query(
            `SELECT mem_id FROM member WHERE mem_name='${name}'`,
            (err, result) => {
              if (err) {
                res.send("ເກີດຂໍ້ຜິດພາດ: " + err);
              } else {
                if (result.length >= 1) {
                  res.send("ເກີດຂໍ້ຜິດພາດ: ຊື່ຜູ້ໃຊ້ງານຊ້ຳກັນ Douplicate data");
                } else {
                   db.query(
                    "INSERT IGNORE INTO `member`( `mem_id`,`brc_code`,`group_code`, `mem_pass`, `mem_name`, `mem_lname`, `mem_village`, `mem_dist`, `mem_pro`, `active`, `admin`,`mem_rec`,`mem_tel`,`com_sale`,`com_win`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                    [
                      logid,
                      brc_code,
                      group_code,
                      logpass,
                      name,
                      lname,
                      vill,
                      dist,
                      pro,
                      active,
                      admin,
                      rec,
                      tel,
                      com_sale,
                      com_win,
                    ],
                    (err, result) => {
                      if (err) {
                        console.log(err);
                        res.send("ເກີດຂໍ້ຜິດພາດທາງເຊີເວີ້!!!!");
                      } else {
                        res.send("ເພີ່ມຂໍ້ມູນສຳເລັດ");
                      }
                    }
                  );
                }
              }
            }
          );
        } else {
          console.log(
            "::::::::::::::LICENSE CREATE USER REACH MAXIMUM::::::::::::::"
          );
          res.send("ດຳເນີນການບໍ່ສຳເລັດ ສະມາຊິກເກີນຂະຫນາດຂອງເຊີເວີ");
        }
      }
    }
  );
};
const updateMember = async (req, res) => {
  console.log("::::::::::::::UPDATE USER::::::::::::::");
  console.log("UPDATE USER");
  const id = req.body.id;
  const name = req.body.name;
  const lname = req.body.lname;
  const logid = req.body.logid;
  const logpass = bcrypt.hash(req.body.logpass); //req.body.logpass;
  const vill = req.body.vill;
  const dist = req.body.dist;
  const pro = req.body.pro;
  const active = req.body.active;
  const admin = req.body.admin;
  const rec = req.body.mem_rec;
  const tel = req.body.mem_tel;
  const com_sale = req.body.com_sale;
  const com_win = req.body.com_win;
  const brc_code = req.body.brc_code;
  const group_code = req.body.group_code;
  console.log("up id" + id);
  console.log("up id" + name);
  await db.query(
    "UPDATE `member` SET `mem_id`=?,`brc_code`=?,`mem_name`=?,`mem_lname`=?,`mem_village`=?,`mem_dist`=?,`mem_pro`=?,`active`=?,`admin`=?,`mem_rec`=?,`mem_tel`=?,`com_sale`=?,`com_win`=?,`group_code`=? WHERE `id`=?",
    [
      logid,
      brc_code,
      name,
      lname,
      vill,
      dist,
      pro,
      active,
      admin,
      rec,
      tel,
      com_sale,
      com_win,
      group_code,
      id,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send("ເກີດຂໍ້ຜິດພາດທາງດ້ານເຊີເວີ");
      } else {
        res.send("ອັບເດດຂໍ້ມູນຮຽບຮ້ອຍ");
      }
    }
  );
};
//::::::::::::::RESET PASSWORD::::::::::::::
const resetPassword = async (req, res) => {
  console.log("//::::::::::::::RESET PASSWORD::::::::::::::");
  const id = req.body.id;
  const logpass = bcrypt.hash(req.body.logpass); //req.body.logpass;
  console.log("up id" + id);
  await db.query(
    "UPDATE `member` SET `mem_pass`=? WHERE `id`=?",
    [logpass, id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send("ເກີດຂໍ້ຜິດພາດທາງດ້ານເຊີເວີ");
      } else {
        res.send("ອັບເດດຂໍ້ມູນຮຽບຮ້ອຍ");
      }
    }
  );
};

//::::::::::::::GEN MEMID::::::::::::::
const genId = async (req, res) => {
  console.log("//::::::::::::::GEN MEMID::::::::::::::");
  await db.query(
    "SELECT MAX(mem_id) AS mem_id FROM `member` HAVING MAX(mem_id) IS NOT null ",
    (err, result) => {
      if (err) {
        res.send(err);
      } else {
        if (result.length < 1) {
          res.send((result = [{ mem_id: 1000 }]));
        } else {
          res.send(result);
        }
      }
    }
  );
};
//::::::::::::::FETCH MEMBERID::::::::::::::
const getMemberById = async (req, res) => {
  const param_id = req.query.id;
  console.log("//::::::::::::::FETCH MEMBER ID::::::::::::::");
  console.log("USER ID: " + param_id);
  const sql_query = " SELECT * FROM `member` WHERE id = " + param_id;
  await db.query(sql_query, (err, result) => {
    if (err) {
      console.log(err);
      res.send("ເກີດຂໍ້ຜິດພາດທາງດ້ານເຊີເວີ: " + err);
    } else {
      res.send(result);
    }
  });
};
//::::::::::::::FETCH MEMBER::::::::::::::
const getMember = async (req, res) => {
  console.log("//::::::::::::::FETCH MEMBER::::::::::::::");
  const p_master = req.query.p_master;
  const p_mem_id = req.query.p_mem_id;
  console.log(p_mem_id + "======" + p_master);
  let sql = `SELECT m.*, SUM(s.sale_price ) AS total,win.sale_num,win.sale_price,win.win_amount FROM member m LEFT JOIN sale s ON m.mem_id=s.mem_id AND s.is_cancel=0 AND s.ism_id=(SELECT MAX(i.ism_ref) FROM installment i) LEFT JOIN (SELECT s.*,i.ism_result,SUM(s.sale_price*(SELECT IF(LENGTH(s.sale_num)=2,pay_two,IF(LENGTH(s.sale_num)=3,pay_three,IF(LENGTH(s.sale_num)=4,pay_four,IF(LENGTH(s.sale_num)=5,pay_five,pay_six)))) FROM payrate) /1000) AS win_amount FROM installment i RIGHT JOIN sale s ON s.ism_id=i.ism_ref AND s.is_cancel=0 WHERE i.ism_date =(SELECT MAX(ism_date) FROM installment) AND (s.sale_num = SUBSTRING(i.ism_result, -6, 6) OR s.sale_num = SUBSTRING(i.ism_result, -5, 5) OR s.sale_num = SUBSTRING(i.ism_result, -4, 4) OR s.sale_num = SUBSTRING(i.ism_result, -3, 3) OR s.sale_num = SUBSTRING(i.ism_result, -2, 2)) GROUP BY s.mem_id  ORDER BY s.id DESC) AS win ON win.mem_id=m.mem_id WHERE m.mem_id IN (SELECT mn.mem_id  FROM member mn WHERE mn.brc_code=(SELECT m.brc_code FROM member m WHERE m.mem_id='${p_mem_id}' ) ) GROUP BY m.id ORDER BY m.brc_code,m.mem_name`;
  if (p_master == 1) {
    console.log("::::::::::MASTER REPORT:::::::");
    sql =
      "SELECT m.*, SUM(s.sale_price ) AS total,win.sale_num,win.sale_price,win.win_amount FROM member m LEFT JOIN sale s ON m.mem_id=s.mem_id AND s.is_cancel=0 AND s.ism_id=(SELECT MAX(i.ism_ref) FROM installment i) LEFT JOIN (SELECT s.*,i.ism_result,SUM(s.sale_price*(SELECT IF(LENGTH(s.sale_num)=2,pay_two,IF(LENGTH(s.sale_num)=3,pay_three,IF(LENGTH(s.sale_num)=4,pay_four,IF(LENGTH(s.sale_num)=5,pay_five,pay_six)))) FROM payrate) /1000) AS win_amount FROM installment i RIGHT JOIN sale s ON s.ism_id=i.ism_ref AND s.is_cancel=0 WHERE i.ism_date =(SELECT MAX(ism_date) FROM installment) AND (s.sale_num = SUBSTRING(i.ism_result, -6, 6) OR s.sale_num = SUBSTRING(i.ism_result, -5, 5) OR s.sale_num = SUBSTRING(i.ism_result, -4, 4) OR s.sale_num = SUBSTRING(i.ism_result, -3, 3) OR s.sale_num = SUBSTRING(i.ism_result, -2, 2)) GROUP BY s.mem_id  ORDER BY s.id DESC) AS win ON win.mem_id=m.mem_id GROUP BY m.id ORDER BY m.brc_code,m.mem_name";
  }
  await db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.send("ເກີດຂໍ້ຜິດພາດທາງດ້ານເຊີເວີ: " + err);
    } else {
      res.send(result);
    }
  });
};

module.exports = {
  genId,
  createMember,
  updateMember,
  getMember,
  getMemberById,
  resetPassword,
};
