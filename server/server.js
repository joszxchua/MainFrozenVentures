const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "main-frozen-ventures",
});

app.get("/", (re, res) => {
  return res.json("From backend side");
});

app.get("/accountInfo", (req, res) => {
  const sql = "SELECT * FROM account_info";
  db.query(sql, (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});

app.post("/createAccount", (req, res) => {
  const sql =
    "INSERT INTO account_info (`userRole, email, phone, password`) VALUES (?)";
  const values = [
    req.body.userRole,
    req.body.email,
    req.body.phone,
    req.body.password,
  ];
  db.query(sql, [values], (err, data) => {
    if (err) {
      return res.json("Error");
    } else {
      return res.json(data);
    }
  });
});

app.listen(8081, () => {
  console.log("Port 8081 listening");
});
