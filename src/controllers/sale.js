const logger = require("../api/logger");
const conn = require("../config/dbconn");
const con = require("../config/dbconnPromise");
const saleService = require("../service/sale")
const reverse = async (req, res) => {
    console.log("//::::::::::::::CANCEL BILL::::::::::::::");
    const { billId, cdate } = req.body;
    console.log(":::::::::::::::INVESTIGATE IF THE ISM IS CLOSE::::::::::");
    const sql_investigate = `SELECT s.mem_id,i.ism_active FROM sale s LEFT JOIN installment i ON s.ism_id= i.ism_ref WHERE s.sale_bill_id= ${billId}`;
    conn.query(sql_investigate, (err, result) => {
        if (err) return res.send("ເກີດປັນຫາການເຊື່ອມຖານຂໍ້ມູນ: " + err);
        console.log("RESULT" + result);
        if (result[0]["ism_active"] == 0) return res.status(404).send("ງວດປິດແລ້ວບໍ່ສາມາດຍົກເລີກບິນໄດ້");
        console.log("::::::::::ເປີດງວດຢູ່::::::::::::");
        const sql = `UPDATE sale SET is_cancel=1,cac_date="${cdate}" WHERE sale_bill_id="${billId}"`;
        processResversal(sql, res)
    });

};

const processResversal = async (sql, res) => {
    try {
        const [rows, fields] = await con.query(sql)
        res.send("Completed");
    } catch (error) {
        logger.error("Server error " + error)
        res.send("Error");
    }
}

const sale = async (req, res) => {
    console.log("//::::::::::::::SALE::::::::::::::");
    const { item, user, ism, qr_code } = req.body;
    let listOfOverNumber = [];
    // let branch;
    // TODO: Improve sale process logic
    // MANUAL ALLOW 5,6 NUMBER SALE
    // ********* CHECK WHERE IS THE USER BRANCH ********
    const branch = await saleService.takeUserBranch(user);
    // END MANUAL ALLOW 5,6 NUMBER SALE
    // ************** CHECK IF ANY NUMBER IS ALREADY OVER LIMINTED ************ //
    for (var i = 0; i < item.length; i++) {
        console.log("For: " + item[i].lek + " Laka:" + item[i].sale);
        const luck_num = item[i].lek;
        const price_buy = item[i].sale;
        const isfull = await fullLotCheck(luck_num, price_buy, ism, branch);
        console.log("isfull: " + isfull);
        if (isfull !== "passed") {
            listOfOverNumber.push({ item: isfull });
        }
    }
    // ************ FORM SQL COMMAND FOR MULTI ROWS INSERT ************
    if (listOfOverNumber.length < 1) {
        logger.error("Total transaction: " + item.length);
        const bill_num = await get_billnum();
        const sqlCommand = formSqlCommandForMultiRows(item, bill_num)
        console.log("SQL: " + sql);
        conn.query(sqlCommand,
            (er, result) => {
                if (er) {
                    logger.error("Database error: ", er)
                    return res.send("ເກີດຂໍ້ຜິດພາດທາງເຊີເວີ SQL query");
                } else {
                    listOfOverNumber.push({
                        item: "ສຳເລັດການຂາຍ",
                        bill_num: String(bill_num),
                    });
                    logger.info("Transaction completed")
                    return res.send(listOfOverNumber);
                }
            }
        );
    } else {
        res.send(listOfOverNumber);
    }
};
const formSqlCommandForMultiRows = (sale, bill_num) => {
    const sqlValueConcatination = '';
    for (let i = 0; i < sale.length; i++) {
        const colon = i < sale.length - 1 ? "," : ";";
        sqlValueConcatination +=
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
    const sqlCommand = `INSERT INTO sale(sale_bill_id, ism_id, sale_num, sale_price, mem_id, client_date,qr_code) VALUES${sqlValueConcatination} `
    return sqlCommand
}
async function get_billnum() {
    const [rows, fields] = await con.query(
        `SELECT MAX(sale_bill_id) as pre_bill FROM sale HAVING MAX(sale_bill_id) IS NOT null`
    );
    if (rows.length < 1) {
        return 214303061761012;
    } else {
        const next_ref = BigInt(rows[0].pre_bill) + 1n;
        return next_ref;
    }
}//abcd
const fullLotCheck = async (luck_num, price, ism_ref, brc) => {
    let luck_num_type = "";
    let isover = [];
    const luckNLen = luck_num.length;
    let sqlComMax;
    let sqlConditn = `IN ('${brc}')`;
    switch (luckNLen) {
        case 2:
            luck_num_type = "two_digits";
            break;
        case 3:
            luck_num_type = "three_digits";
            break;
        case 4:
            luck_num_type = "four_digits";
            break;
        case 5:
            luck_num_type = "five_digits";
            break;
        case 6:
            luck_num_type = "six_digits";
            break;
        default:
            isover.push(`ເລກ: ${luck_num} ຕ້ອງຊື້ ສອງໂຕ${luckNLen}ຂື້ນໄປ`);
            return isover;
    }

    console.log("number:" + luck_num + " price: " + price + "ism: " + ism_ref);
    try {
        const [rows, fields] = await con.query(`SELECT l.brc_code FROM salelimit l WHERE l.brc_code='${brc}'`)

        if (rows.length == 0) {
            brc = "DEFAULT"; //ຖ້າສາຂາໃດບໍ່ໄດ້ກຳນົດເລກເຕັມຮູ ແມ່ນໃຫ້ໃຊ້ ເລກເຕັມຮູຂອງ ສາຂາ Default ມາໄລ່
            sqlConditn = `NOT IN (SELECT BRC_CODE FROM salelimit WHERE BRC_CODE NOT IN('${brc}'))`
        }
        sqlComMax = `
    SELECT IFNULL(SUM(s.sale_price),0) AS total,IFNULL(l.${luck_num_type},0) AS maxsale FROM branch b
    LEFT JOIN member m ON m.brc_code=b.co_code
    LEFT JOIN sale s on s.mem_id=m.mem_id and s.ism_id=(SELECT MAX(i.ism_ref) FROM installment i) AND s.is_cancel=0 AND s.sale_num='${luck_num}'
    LEFT JOIN salelimit l ON l.brc_code='${brc}'
    WHERE b.co_code ${sqlConditn}`
        // WHERE b.co_code NOT IN('${brc}')`
        return await fullLotCheckSub(sqlComMax, luck_num, price);
    } catch (error) {
        isover.push(
            "ເກີດຂໍ້ຜິດພາດ ທາງເຊີເວີ"
        );
        console.log("Error: " + error);
        return isover;
    }
}



const fullLotCheckSub = async (sqlComMax, luck_num, price) => {
    let isover = [];
    try {
        const [rows, fields] = await con.query(sqlComMax);
        const availableToSale = rows[0].maxsale - parseInt(rows[0].total);
        const alreadySold = parseInt(rows[0].total);
        const maxSale = parseInt(rows[0].maxsale);
        console.log("Avai: " + Intl.NumberFormat().format(availableToSale) + " Sold: " + Intl.NumberFormat().format(alreadySold) + " Max: " + Intl.NumberFormat().format(maxSale));
        if (price < 1000) {
            isover.push("ເລກ: " + luck_num + " ຕ້ອງຊື້ 1,000 ກີບຂື້ນໄປ");
            return isover;
        } else if (maxSale < price) {
            logger.error(`Transaction ${luck_num} is over `)
            isover.push(
                "ເລກ: " +
                luck_num +
                " ເຕັມ ວ່າງ: " +
                Intl.NumberFormat().format(availableToSale) +
                " ຍອດຕ້ອງການຊື້: " +
                Intl.NumberFormat().format(price)
            );
            return isover;
        } else if (maxSale >= alreadySold + price) {
            return "passed";
        } else {
            logger.error(`Transaction ${luck_num} is over `)
            isover.push(
                "ເລກ: " +
                luck_num +
                " ເຕັມ ວ່າງ: " +
                Intl.NumberFormat().format(availableToSale) +
                " ຍອດຕ້ອງການຊື້: " +
                Intl.NumberFormat().format(price)
            );
            return isover;
        }
    } catch (error) {
        isover.push(
            "ເກີດຂໍ້ຜິດພາດ ທາງເຊີເວີ " + error
        );
        logger.error("Cannot chek number sale limited: " + error);
        return isover;
    }
}

module.exports = {
    sale,
    reverse,
};
