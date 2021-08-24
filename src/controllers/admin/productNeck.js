const db = require("../../config/dbconn");
const getProductNeck = async (req, res) => {
  console.log("//::::::::::::::FULL LIMMITED::::::::::::::");
  await db.query("SELECT * FROM salelimit", (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
};
const updateProductNeck = async (req, res) => {
  console.log("//::::::::::::::UPDATE LIMMITED::::::::::::::");
  const id = req.query.id;
  const two = req.body.two;
  const three = req.body.three;
  const four = req.body.four;
  const five = req.body.five;
  const six = req.body.six;
  console.log(id);
  await db.query(
    "UPDATE `salelimit` SET `two_digits`=?,`three_digits`=?,`four_digits`=?,`five_digits`=?,`six_digits`=? WHERE `id`=?",
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
module.exports={
    getProductNeck,
    updateProductNeck,
}
