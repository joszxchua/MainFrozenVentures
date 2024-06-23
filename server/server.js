const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/", (re, res) => {
  return res.json("From backend side");
});

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'main-frozen-ventures',
})

app.listen(8081, () => {
  console.log("Port 8081 listening");
});
