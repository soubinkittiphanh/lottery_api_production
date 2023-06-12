const db = require("../config/dbconn");
const jwt = require('jsonwebtoken');
const bcrypt = require("../../custom-bcrypt");
const logger = require('./logger');
const secretKey = require('../config').actksecret;
const validateToken = (req, res, next) => {
    const dateTime = new Date(Date.now()).toLocaleString()
    logger.info("Request date time ", dateTime);
    const authHeader = req.headers['authorization']
    logger.info("Middleware header: " + authHeader);
    const token = authHeader && authHeader.split(' ')[1]
    logger.info("Token: ", token || "No token provided");
    if (token == null) return res.status(401).send('Invalid token')
    jwt.verify(token, secretKey, (er, user) => {
        if (er) return res.status(403).send('Token invalid or expired!')//res.sendStatus(403).send('invalid')
        logger.info(user);
        req.user = user;
        next()
    })
}

// const sigon = async (req, res) => {
//     const body = req.body;
//     console.log("************* Member auth  *****************");
//     console.log(`*************Payload: ${body} *****************`);
//     const u_id = body.mem_id;
//     const u_pw = body.mem_pwd;
//     console.log("mem_id: " + u_id);
//     console.log("mem_password: " + u_pw);
//     Db.query(`SELECT * FROM user_account WHERE user_id='${u_id}' AND user_pass='${u_pw}'`, (er, re) => {
//         if (er) return res.send("Error: " + er)
//         if (re[0]) {
//             const { user_id, user_name, user_tel, user_desc } = re[0]
//             console.log("user data: ", user_desc);
//             res.send(Login.login(user_name, user_id, user_tel, "_", 0, 0))

//         } else {
//             res.send({ "accessToken": "", "error": "ລະຫັດຜ່ານ ຫລື ໄອດີບໍ່ຖືກຕ້ອງ" })
//         }


//     })
// }

const signOn = async (req, res) => {
    const {uid,upas} = req.body;
    console.log("//::::::::::::::LOGIN::::::::::::::");
    console.log(uid);
    console.log(upas);
    if(!uid,!upas) return res.send('User name and password require !')
    // SELECT m.mem_id as mem_id,m.com_sale as com_sale,m.com_win as com_win, m.mem_pass as mem_pass,m.mem_name as mem_name,m.active as active,m.admin as admin, MAX(i.ism_ref) as ism_ref, i.ism_date as ism_date FROM member m LEFT JOIN installment i ON i.ism_active = 1  WHERE mem_id =? and active=1
    const sql =
        `SELECT FLOOR(SUM(IF(s.is_cancel=0,s.sale_price,0))*com_sale/100) AS sale,
      m.brc_code,b.co_comm, m.mem_id as mem_id,
      m.com_sale as com_sale,m.com_win as com_win,
      m.mem_pass as mem_pass,m.mem_name as mem_name,
      m.active as active,m.admin as admin, MAX(i.ism_ref) as ism_ref, 
      i.ism_date as ism_date,g.m_home,g.m_category,g.m_branch,
      g.m_limited_price,g.m_pay_rate,g.m_sale,g.m_re_sale,
      g.m_re_win,g.m_list_member,g.m_add_member,g.m_master,
      g.m_group FROM member m 
      LEFT JOIN installment i ON i.ism_active = 1 
      LEFT JOIN tbl_group_permission g ON m.group_code=g.group_code 
      LEFT JOIN branch b ON b.co_code=m.brc_code 
      LEFT JOIN sale s ON s.mem_id=m.mem_id AND s.ism_id=(SELECT MAX(ism_ref) 
      FROM installment) WHERE m.mem_id ='${uid}' and active=1`;
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            if (!result[0].mem_id) {
                return res.status(401).send('User not found');
            }
            const isValidPassword = bcrypt.compare(upas, result[0].mem_pass);
            if (isValidPassword) {
                logger.info("Password validated")
                const user = {
                    id:result[0]['mem_id'],
                    name:result[0]['mem_name'],
                }
                const token = generateToken(user)
               return  res.status(200).send({result,token});
            } else {
                console.log("Authenthicated fail.....");
                return res.status(401).send('Invalid password');
            }
        }
    });
};

const generateToken = (user) => {
    const token = jwt.sign(user, secretKey, { expiresIn: '2h' });
    return token
}
module.exports = {
    validateToken,
    signOn,
}