const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db");

const router = express.Router();

router.post("/personalUpdate", (req, res) => {
  const { accountId, firstName, lastName, gender, birthdate } = req.body;

  const fields = { accountId, firstName, lastName, gender, birthdate };
  const missingFields = [];

  for (const [key, value] of Object.entries(fields)) {
    if (!value) {
      missingFields.push(key);
    }
  }

  if (missingFields.length > 0) {
    return res.status(200).json({
      status: "error",
      message: "All fields are required",
      missingFields: missingFields,
    });
  }

  const sqlFetch = "SELECT * FROM personal_info WHERE accountID = ?";
  db.query(sqlFetch, [accountId], (err, results) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Database error",
        error: err,
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No personal info found for the account ID",
      });
    }

    const existingPersonalInfo = results[0];

    let updateRequired = false;
    const updatedFields = {};

    if (firstName && firstName !== existingPersonalInfo.firstName) {
      updatedFields.firstName = firstName;
      updateRequired = true;
    }
    if (lastName && lastName !== existingPersonalInfo.lastName) {
      updatedFields.lastName = lastName;
      updateRequired = true;
    }
    if (gender && gender !== existingPersonalInfo.gender) {
      updatedFields.gender = gender;
      updateRequired = true;
    }
    if (birthdate && birthdate !== existingPersonalInfo.birthdate) {
      updatedFields.birthdate = birthdate;
      updateRequired = true;
    }

    if (!updateRequired) {
      return res.status(200).json({
        status: "success",
        message: "No changes made in personal information",
      });
    }

    const sqlUpdate =
      "UPDATE personal_info SET firstName=?, lastName=?, gender=?, birthdate=? WHERE accountID=?";

    db.query(
      sqlUpdate,
      [
        updatedFields.firstName || existingPersonalInfo.firstName,
        updatedFields.lastName || existingPersonalInfo.lastName,
        updatedFields.gender || existingPersonalInfo.gender,
        updatedFields.birthdate || existingPersonalInfo.birthdate,
        accountId,
      ],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            status: "error",
            message: "Error updating personal information",
            error: err,
          });
        }

        res.status(200).json({
          status: "success",
          message: "Personal information updated successfully",
        });
      }
    );
  });
});

router.post("/accountFetch", (req, res) => {
  const { accountId } = req.body;

  if (!accountId) {
    return res.json({
      status: 0,
      message: "Account ID is required",
    });
  }

  const sql = `SELECT ai.*, pi.*
              FROM account_info ai
              LEFT JOIN personal_info pi ON ai.accountID = pi.accountID
              WHERE ai.accountID = ?`;

  db.query(sql, [accountId], (err, results) => {
    if (err) {
      return res.json({ status: 0, message: "Database error", error: err });
    }

    if (results.length === 0) {
      return res.json({
        status: 0,
        message: "No account found with the provided account ID",
      });
    }

    const account = results[0];
    return res.json({
      status: 1,
      message: "Account information fetched successfully",
      account: account,
    });
  });
});

router.post("/accountSignIn", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({
      status: 0,
      message: "Email/phone and password are required",
    });
  }

  const sql = `
      SELECT ai.accountID, ai.userRole, ai.email, ai.phone, ai.password, si.shopID, si.isVerified
      FROM account_info ai
      LEFT JOIN shop_info si ON ai.accountID = si.accountID
      WHERE ai.email = ? OR ai.phone = ?
    `;

  db.query(sql, [username, username], (err, results) => {
    if (err) {
      return res.json({ status: 0, message: "Database error", error: err });
    }

    if (results.length === 0) {
      return res.json({
        status: 0,
        message: "Invalid email/phone or password",
      });
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.json({
          status: 0,
          message: "Error verifying password",
          error: err,
        });
      }

      if (isMatch) {
        const { password, ...userWithoutPassword } = user;
        return res.json({
          status: 1,
          message: "Signed in successfully",
          user: userWithoutPassword,
        });
      } else {
        return res.json({
          status: 0,
          message: "Invalid email/phone or password",
        });
      }
    });
  });
});

router.post("/createAccount", async (req, res) => {
  const accountInfo = req.body;

  const requiredFields = [
    "email",
    "userRole",
    "password",
    "confirmPassword",
    "phone",
    "firstName",
    "lastName",
    "gender",
    "birthdate",
    "street",
    "barangay",
    "municipality",
    "province",
    "zipCode",
  ];
  for (const field of requiredFields) {
    if (!accountInfo[field]) {
      return res.json({
        status: 0,
        message: `Missing or invalid data on ${field}`,
      });
    }
  }

  if (!/\S+@\S+\.\S+/.test(accountInfo.email)) {
    return res.json({ status: 0, message: "Invalid email format" });
  }

  if (
    accountInfo.password.length < 8 ||
    !/[A-Za-z]/.test(accountInfo.password) ||
    !/\d/.test(accountInfo.password)
  ) {
    return res.json({
      status: 0,
      message:
        "Password must have at least 8 characters and include both letters and numbers",
    });
  }

  if (accountInfo.password !== accountInfo.confirmPassword) {
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

  if (!["male", "female", "prefer-not-to-say"].includes(accountInfo.gender)) {
    return res.json({ status: 0, message: "Invalid gender" });
  }

  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(accountInfo.birthdate) ||
    isNaN(new Date(accountInfo.birthdate).getTime())
  ) {
    return res.json({
      status: 0,
      message: "Invalid birthdate format. Use yyyy-mm-dd",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(accountInfo.password, 10);

    db.query(
      "SELECT * FROM account_info WHERE email = ? OR phone = ?",
      [accountInfo.email, accountInfo.phone],
      (err, result) => {
        if (err)
          return res.json({ status: 0, message: "Database query error" });

        if (result.length > 0) {
          const existingEmail = result.find(
            (r) => r.email === accountInfo.email
          );
          const existingPhone = result.find(
            (r) => r.phone === accountInfo.phone
          );
          if (existingEmail) {
            return res.json({ status: 0, message: "Email already exists" });
          }
          if (existingPhone) {
            return res.json({
              status: 0,
              message: "Phone number already exists",
            });
          }
        }

        db.query(
          "INSERT INTO account_info (email, userRole, password, phone) VALUES (?, ?, ?, ?)",
          [
            accountInfo.email,
            accountInfo.userRole,
            hashedPassword,
            accountInfo.phone,
          ],
          (err, result) => {
            if (err)
              return res.json({ status: 0, message: "Database insert error" });

            const accountID = result.insertId;

            db.query(
              "INSERT INTO personal_info (accountID, firstName, lastName, gender, birthdate, street, barangay, municipality, province, zipCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
              [
                accountID,
                accountInfo.firstName,
                accountInfo.lastName,
                accountInfo.gender,
                accountInfo.birthdate,
                accountInfo.street,
                accountInfo.barangay,
                accountInfo.municipality,
                accountInfo.province,
                accountInfo.zipCode,
              ],
              (err, result) => {
                if (err)
                  return res.json({
                    status: 0,
                    message: "Database insert error",
                  });

                res.json({
                  status: 1,
                  message: "Account created successfully",
                });
              }
            );
          }
        );
      }
    );
  } catch (error) {
    console.error("Error creating account:", error);
    res.json({ status: 0, message: "Error creating account" });
  }
});

module.exports = router;
