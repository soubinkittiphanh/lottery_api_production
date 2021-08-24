const db = require("../../config/dbconn");
const getISM = async (req, res) => {
  const param_date = req.query.date;
  console.log("//::::::::::::::INSTALLMENT FETCH::::::::::::::");
  await db.query(
    "SELECT * FROM installment where ism_date=?",
    [param_date],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
};
const createISM = async (req, res) => {
  const i_ref = req.body.ism_ref;
  const i_date = req.body.ism_date;
  const i_res = req.body.ism_res;
  const i_active = req.body.ism_active;
  console.log("//::::::::::::::CREATE ISM::::::::::::::");
  await db.query(
    "INSERT INTO installment(ism_ref, ism_date, ism_result, ism_active) values(?,?,?,?)",
    [i_ref, i_date, i_res, i_active],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("ຂໍ້ມູນບັນທຶກສຳເລັດ");
      }
    }
  );
};
const updateISM = async (req, res) => {
  const ref = req.body.ism_ref;
  const id = req.body.ism_id;
  const date = req.body.ism_date;
  const result = req.body.ism_result;
  const active = req.body.ism_active;
  console.log("//::::::::::::::UPDATE ISM::::::::::::::");
  console.log(id);
  console.log(result);
  await db.query(
    "UPDATE installment SET ism_ref= ?,ism_date=?,ism_result=?,ism_active=? WHERE id= ? ",
    [ref, date, result, active, id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("ຂໍ້ມູນຖືກບັນທຶກຮຽບຮ້ອຍ");
      }
    }
  );
};
const genISMID = async (req, res) => {
  console.log("//::::::::::::::ISM FETCH::::::::::::::");
  await db.query(
    "SELECT MAX(`ism_ref`) as cur_ref FROM `installment` HAVING MAX(`ism_ref`) IS NOT null",
    (er, result) => {
      var numRows = result.length;
      console.log(numRows);
      if (er) {
        res.send(er);
      } else if (result) {
        if (numRows < 1) {
          res.send("10000");
        } else {
          const next_ref = result[0].cur_ref + 1;
          res.send("" + next_ref);
        }

        console.log("//::::::::::::::ກວດສອບງວດ::::::::::::::");
        console.log(result);
      }
    }
  );
};
const getISMREF = async (req, res) => {
  console.log("//::::::::::::::GET ISM REF MAX::::::::::::::");
  await db.query(
    "SELECT  MAX(ism_ref) as ism_ref, ism_date FROM installment  WHERE ism_active = 1 LIMIT 1",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log("res");
        res.send(result);
      }
    }
  );
};
module.exports = {
  getISM,
  createISM,
  updateISM,
  genISMID,
  getISMREF,
};
