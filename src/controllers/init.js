const db = require("../config/dbconn");
const bcrypt=require("../../custom-bcrypt");
const home = (req, reply) => {
  reply.send("Hello we are waiting for your request :-)");
};
const dbuser = async (req, reply) => {
  await db.query("SELECT * FROM employee", (err, result) => {
    if (err) {
      reply.send("ERROR " + err);
    } else {
      reply.send(result);
    }
  });
};
const auth = async (req, res) => {
  const uid = req.body.id;
  const upas = req.body.pass;
  console.log("//::::::::::::::LOGIN::::::::::::::");
  console.log(uid);
  console.log(upas);
  // SELECT m.mem_id as mem_id,m.com_sale as com_sale,m.com_win as com_win, m.mem_pass as mem_pass,m.mem_name as mem_name,m.active as active,m.admin as admin, MAX(i.ism_ref) as ism_ref, i.ism_date as ism_date FROM member m LEFT JOIN installment i ON i.ism_active = 1  WHERE mem_id =? and active=1
  const sql =
    "SELECT FLOOR(SUM(IF(s.is_cancel=0,s.sale_price,0))*com_sale/100) AS sale,m.brc_code,b.co_comm, m.mem_id as mem_id,m.com_sale as com_sale,m.com_win as com_win,m.mem_pass as mem_pass,m.mem_name as mem_name,m.active as active,m.admin as admin, MAX(i.ism_ref) as ism_ref, i.ism_date as ism_date,g.m_home,g.m_category,g.m_branch,g.m_limited_price,g.m_pay_rate,g.m_sale,g.m_re_sale,g.m_re_win,g.m_list_member,g.m_add_member,g.m_master,g.m_group FROM member m LEFT JOIN installment i ON i.ism_active = 1 LEFT JOIN tbl_group_permission g ON m.group_code=g.group_code LEFT JOIN branch b ON b.co_code=m.brc_code LEFT JOIN sale s ON s.mem_id=m.mem_id AND s.ism_id=(SELECT MAX(ism_ref) FROM installment) WHERE m.mem_id ='" +
    uid +
    "' and active=1";
  await db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      if (result[0].mem_id === null) {
        res.send((result = [{ isAuth: false }]));
        return;
      }
      const isAuth = bcrypt.compare(upas, result[0].mem_pass);
      if (isAuth) {
        res.send(result);
        console.log(result[0].com_sale);
        console.log("Authenthicated succeed");
      } else {
        res.send((result = [{ isAuth: false }]));
        console.log("Authenthicated fail.....");
      }
    }
  });
};
module.exports = {
  home,
  dbuser,
  auth,
};
