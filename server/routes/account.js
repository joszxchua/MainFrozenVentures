const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db");

const router = express.Router();

router.get("/accountInfo", (req, res) => {
  const sql = "SELECT * FROM account_info";
  db.query(sql, (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});

router.post("/createAccount", async (req, res) => {
  const accountInfo = req.body;

  const requiredAccountFields = ["email", "userRole", "password", "confirmPass", "phone"];
  for (const field of requiredAccountFields) {
    if (!accountInfo[field]) {
      return res.json({
        status: 0,
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} cannot be empty`,
      });
    }
  }

  if (!/\S+@\S+\.\S+/.test(accountInfo.email)) {
    return res.json({ status: 0, message: "Invalid email format" });
  }

  if (accountInfo.password.length < 8 || !/[A-Za-z]/.test(accountInfo.password) || !/\d/.test(accountInfo.password)) {
    return res.json({
      status: 0,
      message: "Password must have at least 8 characters and include both letters and numbers",
    });
  }

  if (accountInfo.password !== accountInfo.confirmPass) {
    return res.json({
      status: 0,
      message: "Password and confirm password do not match",
    });
  }

  if (accountInfo.phone.length !== 11) {
    return res.json({
      status: 0,
      message: "Phone number must be 11 characters long",
    });
  }

  const requiredPersonalFields = ["firstName", "lastName", "gender", "birthdate", "address"];
  for (const field of requiredPersonalFields) {
    if (!accountInfo[field]) {
      return res.json({
        status: 0,
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} cannot be empty`,
      });
    }
  }

  if (!["Male", "Female", "Rather Not Say"].includes(accountInfo.gender)) {
    return res.json({ status: 0, message: "Invalid gender" });
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(accountInfo.birthdate) || isNaN(new Date(accountInfo.birthdate).getTime())) {
    return res.json({
      status: 0,
      message: "Invalid birthdate format. Use yyyy-mm-dd",
    });
  }

  const { street = "", barangay = "", municipality = "", province = "", zipCode = "" } = accountInfo.address;

  const hashedPassword = await bcrypt.hash(accountInfo.password, 10);

  db.query("SELECT * FROM account_info WHERE email = ? OR phone = ?", [accountInfo.email, accountInfo.phone], (err, result) => {
    if (err) return res.json({ status: 0, message: "Database query error" });

    if (result.length > 0) {
      const existingEmail = result.find(r => r.email === accountInfo.email);
      const existingPhone = result.find(r => r.phone === accountInfo.phone);
      if (existingEmail) {
        return res.json({ status: 0, message: "Email already exists" });
      }
      if (existingPhone) {
        return res.json({ status: 0, message: "Phone number already exists" });
      }
    }

    db.query(
      "INSERT INTO account_info (email, userRole, password, phone) VALUES (?, ?, ?, ?)",
      [accountInfo.email, accountInfo.userRole, hashedPassword, accountInfo.phone],
      (err, result) => {
        if (err) return res.json({ status: 0, message: "Database insert error" });

        const accountID = result.insertId;

        db.query(
          "INSERT INTO personal_info (accountID, firstName, lastName, gender, birthdate, street, barangay, municipality, province, zip) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [accountID, accountInfo.firstName, accountInfo.lastName, accountInfo.gender, accountInfo.birthdate, street, barangay, municipality, province, zipCode],
          (err, result) => {
            if (err) return res.json({ status: 0, message: "Database insert error" });

            res.json({ status: 1, message: "Account created successfully" });
          }
        );
      }
    );
  });
});

module.exports = router;