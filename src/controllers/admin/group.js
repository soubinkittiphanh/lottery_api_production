const db = require("../../config/dbconn");

const createGroup = async (req, res) => {
  const g_code = req.body.g_data.code;
  const g_name = req.body.g_data.name;
  const g_desc = req.body.g_data.desc;
  const home = req.body.g_data.menu.m_home;
  const cate = req.body.g_data.menu.m_category;
  const branch = req.body.g_data.menu.m_branch;
  const limited = req.body.g_data.menu.m_limited_price;
  const payrate = req.body.g_data.menu.m_pay_rate;
  const sale = req.body.g_data.menu.m_sale;
  const r_sale = req.body.g_data.menu.m_re_sale;
  const r_wsale = req.body.g_data.menu.m_re_win;
  const l_member = req.body.g_data.menu.m_s_member;
  const i_member = req.body.g_data.menu.m_i_member;
  const m_group = req.body.g_data.menu.m_group;
  const master = req.body.g_data.menu.m_master;
  console.log("::::::::::::::CREATE GROUP::::::::::::::");
  // console.log("DATA abbr:" + abbr + " name:" + name + " desc:" + desc);
  const sql =
    "INSERT IGNORE `tbl_group_permission`(`group_code`, `group_name`, `group_desc`, `m_home`, `m_category`, `m_branch`, `m_limited_price`, `m_pay_rate`, `m_sale`, `m_re_sale`, `m_re_win`, `m_list_member`, `m_add_member`, `m_master`,`m_group`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
  await db.query(
    sql,
    [
      g_code,
      g_name,
      g_desc,
      home,
      cate,
      branch,
      limited,
      payrate,
      sale,
      r_sale,
      r_wsale,
      l_member,
      i_member,
      master,
      m_group,
    ],
    (err, reslt) => {
      if (err) {
        console.log(err);
        res.send("ເກີດຂໍ້ຜິດພາດ: " + err);
      } else {
        console.log("SUCCEED:" + reslt);
        res.send("ດຳເນີນການສຳເລັດ");
      }
    }
  );
};
const updateGroup=async (req, res) => {
    const g_id = req.body.g_data.id;
    const g_code = req.body.g_data.code;
    const g_name = req.body.g_data.name;
    const g_desc = req.body.g_data.desc;
    const home = req.body.g_data.menu.m_home;
    const cate = req.body.g_data.menu.m_category;
    const branch = req.body.g_data.menu.m_branch;
    const limited = req.body.g_data.menu.m_limited_price;
    const payrate = req.body.g_data.menu.m_pay_rate;
    const sale = req.body.g_data.menu.m_sale;
    const r_sale = req.body.g_data.menu.m_re_sale;
    const r_wsale = req.body.g_data.menu.m_re_win;
    const l_member = req.body.g_data.menu.m_s_member;
    const i_member = req.body.g_data.menu.m_i_member;
    const m_group = req.body.g_data.menu.m_group;
    const master = req.body.g_data.menu.m_master;
    console.log("::::::::::::::UPDATE GROUP::::::::::::::");
    // console.log("DATA abbr:" + abbr + " name:" + name + " desc:" + desc);
    const sql =
      "UPDATE `tbl_group_permission` set `group_code`=?, `group_name`=?, `group_desc`=?, `m_home`=?, `m_category`=?, `m_branch`=?, `m_limited_price`=?, `m_pay_rate`=?, `m_sale`=?, `m_re_sale`=?, `m_re_win`=?, `m_list_member`=?, `m_add_member`=?, `m_master`=?,`m_group`=? WHERE `id`=? ";
    await db.query(
      sql,
      [
        g_code,
        g_name,
        g_desc,
        home,
        cate,
        branch,
        limited,
        payrate,
        sale,
        r_sale,
        r_wsale,
        l_member,
        i_member,
        master,
        m_group,
        g_id,
      ],
      (err, reslt) => {
        if (err) {
          console.log(err);
          res.send("ເກີດຂໍ້ຜິດພາດ: " + err);
        } else {
          console.log("SUCCEED:" + reslt);
          res.send("ດຳເນີນການສຳເລັດ");
        }
      }
    );
  };

  const getGroup=async (req, res) => {
    console.log("//::::::::::::::GROUP FETCH::::::::::::::");
    await db.query("SELECT * FROM `tbl_group_permission`", (er, result) => {
      if (er) {
        console.log("//::::::::::::::GROUP FETCH ERROR::::::::::::::");
        return res.send(er);
      } else if (result) {
        console.log("//::::::::::::::GROUP FETCH SUCCEED::::::::::::::");
        res.send(result);
      }
    });
  };
  const getGroupById=async(req, res) => {
    console.log("//::::::::::::::GROUP FETCH::::::::::::::");
    await db.query(
      "SELECT `group_code`,`id` FROM `tbl_group_permission`",
      (er, result) => {
        if (er) {
          console.log("//::::::::::::::GROUP FETCH ERROR::::::::::::::");
          return res.send(er);
        } else if (result) {
          console.log("//::::::::::::::GROUP FETCH SUCCEED::::::::::::::");
          res.send(result);
        }
      }
    );
  }

  module.exports={
      createGroup,
      updateGroup,
      getGroup,
      getGroupById,
  }
