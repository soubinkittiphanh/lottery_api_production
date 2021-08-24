const db = require("../../config/dbconn");

const getPayRate = async (req, res) => {
  console.log("//::::::::::::::PAYRATE FETCH::::::::::::::");
  await db.query("SELECT * FROM payrate", (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
};
//::::::::::::::UPDATE PAYRATE::::::::::::::
const updatePayRate = async (req, res) => {
  console.log("//::::::::::::::UPDATE PAYRATE::::::::::::::");
  const id = req.query.id;
  const two = req.body.two;
  const three = req.body.three;
  const four = req.body.four;
  const five = req.body.five;
  const six = req.body.six;
  console.log(id);
  await db.query(
    "UPDATE `payrate` SET `pay_two`=?,`pay_three`=?,`pay_four`=?,`pay_five`=?,`pay_six`=? WHERE `id`=?",
    [two, three, four, five, six, id],
    (er, result) => {
      if (er) {
        res.send("ມີຂໍ້ຜິດພາດທາງດ້ານເຊີເວີ!");
      } else {
        res.send("ອັບເດດຂໍ້ມູນຮຽບຮ້ອຍ");
      }
    }
  );
};
module.exports = {
  getPayRate,
  updatePayRate,
};
