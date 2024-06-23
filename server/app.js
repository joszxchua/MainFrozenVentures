const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const accountRoutes = require("./routes/account");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/account", accountRoutes);

app.get("/", (req, res) => {
  return res.json("From backend side");
});

app.listen(8081, () => {
  console.log("Server is running on port 8081");
});