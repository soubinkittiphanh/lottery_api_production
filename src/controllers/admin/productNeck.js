const db = require("../../config/dbconn");
const getProductNeck = async (req, res) => {
  console.log("//::::::::::::::FULL LIMMITED::::::::::::::");
  console.log("//::::::::::::::FULL LIMMITED::::::::::::::"+req.query.brc_id);
  const sqlComConditn=req.query.brc_id?` where brc_code ='${req.query.brc_id}'`:'';
  const sqlCom=`SELECT * FROM salelimit ${sqlComConditn}`;
  console.log("sql "+sqlCom);
  await db.query(sqlCom, (err, result) => {
    if (err) {
      console.log('Error');
      res.send(err);
    } else {
      if(result.length==0){
        console.log('less than 0');
        db.query("SELECT * FROM salelimit where brc_code ='POPPY'", (er, re) => {
          if(er)return res.send("Error: "+er)
          res.send(re);
        })
      }else{
        console.log('greater than 0');
        res.send(result);

      }
    }
  });
};
const updateProductNeck = async (req, res) => {
  console.log("//::::::::::::::UPDATE LIMMITED NEW VERSION::::::::::::::");
  const id = req.query.id;
  const two = req.body.two;
  const three = req.body.three;
  const four = req.body.four;
  const five = req.body.five;
  const six = req.body.six;
  const brc_id = req.body.brc_id;
  console.log(id);
  await db.query(`SELECT * FROM salelimit where brc_code='${brc_id}'`,(er,re)=>{
    if(er)return res.send("Error: "+er)
    if(re.length==0){
      db.query(`INSERT INTO salelimit(brc_code, two_digits, three_digits, four_digits, five_digits, six_digits)VALUES(
        '${brc_id}',${two},${three},${four},${five},${six}
      )`,(er,re)=>{
        if(er) return res.send("Error: "+er)
        res.send("Transaction completed");
      });
    }else{
      db.query(
        "UPDATE `salelimit` SET `two_digits`=?,`three_digits`=?,`four_digits`=?,`five_digits`=?,`six_digits`=? WHERE `brc_code`=?",
        [two, three, four, five, six, brc_id],
        (er, result) => {
          if (er) {
            console.log(er);
            res.send("ມີຂໍ້ຜິດພາດທາງດ້ານເຊີເວີ!");
          } else {
            res.send("ອັບເດດຂໍ້ມູນຮຽບຮ້ອຍ");
          }
        }
      );
    }
  });//

};
const cancelProductNeck=async(req,res)=>{
  if(req.body.brc_code=='DEFAULT') return res.send("ບໍ່ສາມາດດຳເນີນການໄດ້ ເນື່ອງຈາກ ລາຍການນີ້ເປັນລາຍການຫລັກ");
  await db.query(`DELETE FROM salelimit WHERE brc_code ='${req.body.brc_code}'`,(er,re)=>{
    if(er) return res.send("Error: "+er)
    res.send("Transaction completed");
  });
}
const createProductNeck=async(req,res)=>{
  const body=req.body;
  const id =req.query.id;
  const two = body.two;
  const three = body.three;
  const four = body.four;
  const five = body.five;
  const six = body.six;
  const brc_id = body.brc_id;
  await db.query(`INSERT INTO salelimit(brc_code, two_digits, three_digits, four_digits, five_digits, six_digits)VALUES(
    ${brc_id},${two},${three},${four},${five},${six}
  )`,(er,re)=>{
    if(er) return res.send("Error: "+er)
    res.send("Transaction completed");
  });
}
module.exports={
    getProductNeck,
    updateProductNeck,
    cancelProductNeck,
}
