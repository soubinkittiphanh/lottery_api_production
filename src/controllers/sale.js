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

        const isfull = await fullLotCheck(luck_num, price_buy, ism, branch);
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
}//abcd
const fullLotCheck = async (luck_num, price, ism_ref, brc) => {
    let luck_num_type = "";
    let isover = [];
    const luckNLen = luck_num.length;
    let sqlComMax;
    let sqlConditn=`IN ('${brc}')`;
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
        const responseData = await con.query(`SELECT l.brc_code FROM salelimit l WHERE l.brc_code='${brc}'`)
        const re = responseData[0];
        console.log(re);
        if (re.length == 0) {
            brc = "DEFAULT"; //ຖ້າສາຂາໃດບໍ່ໄດ້ກຳນົດເລກເຕັມຮູ ແມ່ນໃຫ້ ເລກເຕັມຮູຂອງ ສາຂາ Default ມາໄລ່
            sqlConditn=`NOT IN (SELECT BRC_CODE FROM salelimit WHERE BRC_CODE NOT IN('${brc}'))`
        } else {
            console.log("RE .LENG: " + re.length);
            console.log("RE .CODE: " + re[0]["brc_code"]);
        }

        sqlComMax = `
    SELECT IFNULL(SUM(s.sale_price),0) AS total,IFNULL(l.${luck_num_type},0) AS maxsale FROM branch b
    LEFT JOIN member m ON m.brc_code=b.co_code
    LEFT JOIN sale s on s.mem_id=m.mem_id and s.ism_id=(SELECT MAX(i.ism_ref) FROM installment i) AND s.is_cancel=0 AND s.sale_num='${luck_num}'
    LEFT JOIN salelimit l ON l.brc_code='${brc}'
    WHERE b.co_code ${sqlConditn}`
    // WHERE b.co_code NOT IN('${brc}')`
    console.log("command: "+sqlComMax);
        console.log("ISOVER LEN: " + isover.length);
        return await fullLotCheckSub(sqlComMax, luck_num_type, luck_num, price);
    } catch (error) {
        isover.push(
            "ເກີດຂໍ້ຜິດພາດ ທາງເຊີເວີ"
        );
        console.log("Error: " + error);
        return isover;
    }
}



const fullLotCheckSub = async (sqlComMax, luck_num_type, luck_num, price) => {
    let isover = [];
    try {


        const responseData = await con.query(sqlComMax);
        const re = responseData[0]
        console.log("LIST LEN: " + re[0].length);
        console.log("LEK: " + luck_num_type);
        console.log("Max: " + re[0].maxsale + " Kip")
        const availableToSale = re[0].maxsale - parseInt(re[0].total);
        const alreadySold = parseInt(re[0].total);
        const maxSale = parseInt(re[0].maxsale);
        console.log("Avai: " + Intl.NumberFormat().format(availableToSale) + " Sold: " + Intl.NumberFormat().format(alreadySold) + " Max: " + Intl.NumberFormat().format(maxSale));
        if (price < 1000) {
            isover.push("ເລກ: " + luck_num + " ຕ້ອງຊື້ 1,000 ກີບຂື້ນໄປ");
            return isover;
        } else if (maxSale < price) {
            isover.push(
                "ເລກ: " +
                luck_num +
                " ເຕັມ ວ່າງ: " +
                Intl.NumberFormat().format(availableToSale) +
                " ຍອດຕ້ອງການຊື້: " +
                Intl.NumberFormat().format(price)
            );
            console.log("MAX < PRICE");
            console.log("ISOVER: " + isover[0]);
            return isover;
        } else if (maxSale >= alreadySold + price) {
            return "passed";
        } else {
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
            "ເກີດຂໍ້ຜິດພາດ ທາງເຊີເວີ"
        );
        console.log("Error: " + error);
        return isover;
    }
}

module.exports = {
    sale,
    reverse,
};
