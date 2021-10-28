const conn = require("../config/dbconn");
const con = require("../config/dbconnPromise");
const reverse = async (req, res) => {
  console.log("//::::::::::::::CANCEL BILL::::::::::::::");
  const billId = req.body.billId;
  const cdate = req.body.cdate;
  console.log("------" + cdate);
  console.log(":::::::::::::::INVESTIGATE IF THE ISM IS CLOSE::::::::::");
  const sql_investigate = `SELECT s.mem_id,i.ism_active FROM sale s LEFT JOIN installment i ON s.ism_id= i.ism_ref WHERE s.sale_bill_id= ${billId}`;
  try {
    await conn.query(sql_investigate, (err, result) => {
      if (err) {
        res.send("ເກີດປັນຫາການເຊື່ອມຖານຂໍ້ມູນ: " + err);
      } else {
        console.log("RESULT" + result);
        if (result[0]["ism_active"] == 0) {
          console.log("::::::::::ປິດງວດແລ້ວ::::::::::::");
          res.status(404).send("ງວດປິດແລ້ວບໍ່ສາມາດຍົກເລີກບິນໄດ້");
        } else {
          console.log("::::::::::ເປີດງວດຢູ່::::::::::::");
          const sql = `UPDATE sale SET is_cancel=1,cac_date="${cdate}" WHERE sale_bill_id="${billId}"`;
          conn.query(sql, (er, result) => {
            if (er) {
              console.log("::::::::::ຍົກເລີກບໍ່ສຳເລັດ::::::::::::");
              res.send("Error");
            } else {
              console.log("::::::::::ຍົກເລີກສຳເລັດ::::::::::::");
              res.send("Completed");
            }
          });
        }
      }
    });
  } catch (error) {
    console.log(":::::::cancel bill error=>:::::::::" + error);
  }
};

const sale = async (req, res) => {
  console.log("//::::::::::::::SALE::::::::::::::");
  const sale = req.body.item;
  const user = req.body.user;
  const ism = req.body.ism;
  const qr_code = req.body.qr_code;
  var full_lucknum = [];
  console.log("ID: " + user);
  console.log(sale);
  let branch;

  // MANUAL ALLOW 5,6 NUMBER SALE
  const getBranch = `SELECT brc_code FROM member WHERE mem_id = '${user}'`;
  try {
    const res = await con.query(getBranch);
    branch = res[0][0]["brc_code"];
    console.log("====>{01} BRANCH EUERY: " + res);
    console.log("====>{01} BRANCH EUERY: " + res[0]["brc_code"]);
  } catch (error) {
    console.log("ERROR FROM MANUAUL AWAIT QUERY BRANCH" + error);
  }
  console.log("====> BRANCH EUERY: " + branch);

  // END MANUAL ALLOW 5,6 NUMBER SALE

  for (var i = 0; i < sale.length; i++) {
    console.log("For: " + sale[i].lek + " Laka:" + sale[i].sale);
    const luck_num = sale[i].lek;
    const price_buy = sale[i].sale;

    const isfull = await full_lot_survey(luck_num, price_buy, ism, branch);
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
    conn.query(
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
        }
      }
    );
  } else {
    res.send(full_lucknum);
  }
};
async function get_billnum() {
  const res = await con.query(
    `SELECT MAX(sale_bill_id) as pre_bill FROM sale HAVING MAX(sale_bill_id) IS NOT null`
  );

  const numRows = res[0].length;
  console.log("numrow: " + numRows);
  if (numRows < 1) {
    console.log("LESS THEN 1: " + numRows);
    return 214303061761012;
  } else {
    console.log("OVER THEN 1: " + numRows);
    console.log("NEXT_REF: " + res[0][0].pre_bill);
    const next_ref = BigInt(res[0][0].pre_bill) + 1n;
    console.log("NEXT_REF + 1: " + next_ref);
    return next_ref;
  }
}
async function full_lot_survey(luck_num, price, ism_ref, brc) {
  let luck_num_type = "";
  let isover = [];
  const luckNLen = luck_num.length;
  console.log("Length: " + luckNLen);
  if (luckNLen < 2) {
    console.log("LEN LESS THAN 2:" + brc);
    isover.push("ເລກ: " + luck_num + " ຕ້ອງຊື້ ສອງໂຕຂື້ນໄປ");
    return isover;
  }
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
    // backup current
    // const res = await con.query(
    //   `SELECT SUM(s.sale_price) as total,l.${luck_num_type} as maxsale \
    //   FROM  salelimit l LEFT JOIN  sale s ON s.sale_num = ? and s.ism_id = ? and s.is_cancel=0  WHERE l.id=1  `,
    //   [luck_num, ism_ref]
    // );


    // new block limit price by BRANCH
    const res = await con.query(`
    SELECT IFNULL(SUM(s.sale_price),0) AS total,IFNULL(l.${luck_num_type},0) AS maxsale FROM branch b
LEFT JOIN member m ON m.brc_code=b.co_code
LEFT JOIN sale s on s.mem_id=m.mem_id and s.ism_id=(SELECT MAX(i.ism_ref) FROM installment i) AND s.is_cancel=0 AND s.sale_num='${luck_num}'
LEFT JOIN salelimit l ON l.brc_code='${brc}'
WHERE b.co_code='${brc}'`)
// end new block limit price by BRANCH

    console.log("LEK: " + luck_num_type + " to");
    console.log("Limited: " + res[0][0].maxsale + " Kip");
    console.log(res[0][0]);
    console.log(res[0][0].maxsale);
    const available = res[0][0].maxsale - parseInt(res[0][0].total);
    const saletotal = parseInt(res[0][0].total);
    const manualMaxFiveSPAIY = 1000;
    console.log("BRC OUTSIDE CASE:" + brc);
    if (res[0].length < 1) {
      throw new Error("Post with this id was not found");
    } else if (price < 1000) {
      isover.push("ເລກ: " + luck_num + " ຕ້ອງຊື້ 1,000 ກີບຂື້ນໄປ");
      return isover;
      // } else if ((brc == "SPAIY" || brc == "JOT") && luck_num_type == "five_digits") {
      //   //MANAUL ALLOW 5 AND 6 DIGIT FOR SPAIY
      //   console.log("BRC INSIDE CASE:" + brc);
      //   if (res[0][0].total === null && price > manualMaxFiveSPAIY) {
      //     isover.push(
      //       "ເລກ: " +
      //       luck_num +
      //       " ເຕັມ ວ່າງ: " +
      //       Intl.NumberFormat().format(manualMaxFiveSPAIY) +
      //       " ຍອດຕ້ອງການຊື້: " +
      //       Intl.NumberFormat().format(price)
      //     );
      //     return isover;
      //   } else if (
      //     manualMaxFiveSPAIY >= parseInt(res[0][0].total) + price ||
      //     res[0][0].total == null
      //   ) {
      //     return "passed";
      //   } else {
      //     isover.push(
      //       "ເລກ: " +
      //       luck_num +
      //       " ເຕັມ ວ່າງ: " +
      //       Intl.NumberFormat().format(saletotal - manualMaxFiveSPAIY) +
      //       " ຍອດຕ້ອງການຊື້: " +
      //       Intl.NumberFormat().format(price)
      //     );
      //     return isover;
      //   } // END MANAUL ALLOW 5 AND 6 DIGIT FOR SPAIY
    } else if (res[0][0].total === null && res[0][0].maxsale < price) {
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
  } catch (er) {
    console.log(er);
    throw new Error("Post with this id was not found");
  }
}

module.exports = {
  sale,
  reverse,
};
