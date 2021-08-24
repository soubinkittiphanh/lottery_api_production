const db = require("../config/dbconn");

const reverse = async (req, res) => {
  console.log("//::::::::::::::CANCEL BILL::::::::::::::");
  const billId = req.body.billId;
  const cdate = req.body.cdate;
  console.log("------" + cdate);
  console.log(":::::::::::::::INVESTIGATE IF THE ISM IS CLOSE::::::::::");
  const sql_investigate = `SELECT s.mem_id,i.ism_active FROM sale s LEFT JOIN installment i ON s.ism_id= i.ism_ref WHERE s.sale_bill_id= ${billId}`;
  conn.db.query(`sql_investigate`, (err, result) => {
    if (err) {
      res.send("ເກີດປັນຫາການເຊື່ອມຖານຂໍ້ມູນ: " + err);
    } else {
      console.log("RESULT" + result);
      if (result[0]["ism_active"] == 0) {
        res.status(404).send("ງວດປິດແລ້ວບໍ່ສາມາດຍົກເລີກບິນໄດ້");
      } else {
        const sql = `UPDATE sale SET is_cancel=1,cac_date="${cdate}" WHERE sale_bill_id="${billId}"`;
        conn.db.query(sql, (er, result) => {
          if (er) {
            res.send("Error");
          } else {
            res.send("Completed");
          }
        });
      }
    }
  });
};

const sale = async (req, res) => {
  console.log("//::::::::::::::SALE::::::::::::::");
  const sale = req.body.item;
  const user = req.body.user;
  const ism = req.body.ism;
  // const c_date = req.body.date;
  const qr_code = req.body.qr_code;
  var full_lucknum = [];
  console.log("ID: " + user);
  console.log(sale);
  for (var i = 0; i < sale.length; i++) {
    console.log("For: " + sale[i].lek + " Laka:" + sale[i].sale);
    const luck_num = sale[i].lek;
    const price_buy = sale[i].sale;

    const isfull = await full_lot_survey(luck_num, price_buy, ism);
    console.log("isfull: " + isfull);
    if (isfull !== "passed") {
      full_lucknum.push({ item: isfull });
    }
  }
  console.log("Full count: " + full_lucknum.length);
  console.log("Full detail: " + full_lucknum);
  if (full_lucknum.length < 1) {
    let sql = "";
    console.log("Length:" + sale.length);
    const bill_num = await get_billnum();
    for (let i = 0; i < sale.length; i++) {
      const colon = i < sale.length - 1 ? "," : ";";
      sql +=
        "(" +
        bill_num +
        "," +
        ism +
        ",'" +
        sale[i].lek +
        "'," +
        sale[i].sale +
        "," +
        user +
        ",'" +
        sale[i].date +
        "'," +
        qr_code +
        ")" +
        colon +
        "";
    }

    console.log("SQL: " + sql);
    conn.db.query(
      "INSERT INTO `sale`(`sale_bill_id`, `ism_id`, `sale_num`, `sale_price`, `mem_id`, `client_date`,`qr_code`) VALUES " +
        sql +
        "",
      (er, result) => {
        if (er) {
          res.send("ເກີດຂໍ້ຜິດພາດທາງເຊີເວີ SQL query");
          console.log("Failed");
          console.log(er);
        } else {
          full_lucknum.push({
            item: "ສຳເລັດການຂາຍ",
            bill_num: String(bill_num),
          });
          res.send(full_lucknum);
          console.log("Success");
          console.log(full_lucknum);
          // res.send((item = ["ສຳເລັດການຂາຍ"]));
          // res.send((bill_num = [bill_num]));
        }
      }
    );
  } else {
    res.send(full_lucknum);
  }
};

async function get_billnum() {
  const res = await con.db.query(
    `SELECT MAX(sale_bill_id) as pre_bill FROM sale HAVING MAX(sale_bill_id) IS NOT null`
  );

  // console.log(res[0][0]);
  const numRows = res[0].length;
  console.log("numrow: " + numRows);
  if (numRows < 1) {
    console.log("LESS THEN 1: " + numRows);
    return 214303061761012;
  } else {
    console.log("OVER THEN 1: " + numRows);
    console.log("NEXT_REF: " + res[0][0].pre_bill);
    const next_ref = BigInt(res[0][0].pre_bill) + 1n;
    // const next_ref = BigInt(res[0][0].pre_bill) +1n;
    console.log("NEXT_REF + 1: " + next_ref);
    return next_ref;
  }
}
async function full_lot_survey(luck_num, price, ism_ref) {
  let luck_num_type = "";
  let isover = [];
  const luckNLen = luck_num.length;
  console.log("Length: " + luckNLen);
  if (luckNLen === 2) {
    luck_num_type = "two_digits";
  } else if (luckNLen === 3) {
    luck_num_type = "three_digits";
  } else if (luckNLen === 4) {
    luck_num_type = "four_digits";
  } else if (luckNLen === 5) {
    luck_num_type = "five_digits";
  } else if (luck_num === 6) {
    luck_num_type = "six_digits";
  }

  console.log("number:" + luck_num + " price: " + price + "ism: " + ism_ref);
  try {
    const res = await con.db.query(
      `SELECT SUM(s.sale_price) as total,l.${luck_num_type} as maxsale \
        FROM  salelimit l LEFT JOIN  sale s ON s.sale_num = ? and s.ism_id = ?  WHERE l.id=1  `,
      [luck_num, ism_ref]
    );
    console.log("LEK: " + luck_num_type + " to");
    console.log("Limited: " + res[0][0].maxsale + " Kip");
    console.log(res[0][0]);
    console.log(res[0][0].maxsale);
    const available = res[0][0].maxsale - parseInt(res[0][0].total);
    if (res[0].length < 1) {
      throw new Error("Post with this id was not found");
    } else if (res[0][0].total === null && res[0][0].maxsale < price) {
      // } else if (res[0][0].total == null && res[0][0].maxsale < price) {
      console.log("AlreadySold: " + res[0][0].total);
      console.log("Max: " + res[0][0].maxsale);
      console.log("Buy: " + price);
      console.log("Luck: " + luck_num);
      console.log("Hel: " + res[0][0].maxsale < price);
      isover.push(
        "ເລກ: " +
          luck_num +
          " ເຕັມ ວ່າງ: " +
          Intl.NumberFormat().format(res[0][0].maxsale) +
          " ຍອດຕ້ອງການຊື້: " +
          Intl.NumberFormat().format(price)
      );
      return isover;
    } else if (
      res[0][0].maxsale >= parseInt(res[0][0].total) + price ||
      res[0][0].total == null
    ) {
      return "passed";
    } else {
      isover.push(
        "ເລກ: " +
          luck_num +
          " ເຕັມ ວ່າງ: " +
          Intl.NumberFormat().format(available) +
          " ຍອດຕ້ອງການຊື້: " +
          Intl.NumberFormat().format(price)
      );
      return isover;
    }
  } catch {
    throw new Error("Post with this id was not found");
  }
};

module.exports={
    sale,
    reverse,
}