const express = require("express");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const db = require("../db");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/profileImages");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});

const storageLogo = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/shopLogos");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const uploadLogo = multer({
  storage: storageLogo,
});

const storageDocument = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/shopDocuments");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const uploadDocument = multer({
  storage: storageDocument,
});

router.post(
  "/uploadShopDocuments",
  uploadDocument.single("shopDocument"),
  (req, res) => {
    const shopDocument = req.file.filename;
    const { accountId } = req.body;

    const sql =
      "UPDATE shop_info SET shopDocument = ? WHERE accountID = ?";
    db.query(sql, [shopDocument, accountId], (err, result) => {
      if (err) {
        res.status(200).json({
          status: "error",
          message: "Failed to upload shop document",
        });
        return;
      }

      res.status(200).json({
        status: "success",
        message: "Shop document uploaded successfully",
      });
    });
  }
);

router.post("/shopFetch", (req, res) => {
  const { accountId } = req.body;
  if (!accountId) {
    return res.json({
      status: 0,
      message: "Account ID is required",
    });
  }

  const sql = `SELECT *
              FROM shop_info
              WHERE accountID = ?`;

  db.query(sql, [accountId], (err, results) => {
    if (err) {
      return res.json({ status: 0, message: "Database error", error: err });
    }

    if (results.length === 0) {
      return res.json({
        status: "error",
        message: "No account found with the provided account ID",
      });
    }

    const account = results[0];
    return res.json({
      status: "success",
      message: "Account information fetched successfully",
      account: account,
    });
  });
});

router.post("/setUpShop", uploadLogo.single("shopLogo"), (req, res) => {
  const shopLogo = req.file ? req.file.filename : null;
  const { accountId, shopName, shopDescription } = req.body;

  const selectSql = "SELECT * FROM shop_info WHERE accountID = ?";
  db.query(selectSql, [accountId], (selectErr, selectResult) => {
    if (selectErr) {
      return res.status(500).json({
        status: "error",
        message: "Database query error",
      });
    }

    if (selectResult.length === 0) {
      if (!shopLogo) {
        return res.status(200).json({
          status: "error",
          message: "Shop logo cannot be empty",
        });
      }

      console.log(shopName);

      if (!shopName || shopName === undefined || shopName === "") {
        return res.status(200).json({
          status: "error",
          message: "Shop name cannot be empty",
        });
      }

      if (
        !shopDescription ||
        shopDescription === undefined ||
        shopDescription === ""
      ) {
        return res.status(200).json({
          status: "error",
          message: "Shop description cannot be empty",
        });
      }

      const insertSql =
        "INSERT INTO shop_info (accountID, shopLogo, shopName, shopDescription, status) VALUES (?, ?, ?, ?, ?)";
      db.query(
        insertSql,
        [accountId, shopLogo, shopName, shopDescription, 1],
        (insertErr, insertResult) => {
          if (insertErr) {
            return res.status(200).json({
              status: "error",
              message: "Failed to set up shop",
            });
          }

          res.status(200).json({
            status: "success",
            message: "Shop setup successful",
          });
        }
      );
    } else {
      let updateFields = [];
      let updateValues = [];

      if (shopLogo) {
        updateFields.push("shopLogo = ?");
        updateValues.push(shopLogo);
      }
      if (shopName) {
        updateFields.push("shopName = ?");
        updateValues.push(shopName);
      }
      if (shopDescription) {
        updateFields.push("shopDescription = ?");
        updateValues.push(shopDescription);
      }

      if (updateFields.length > 0) {
        const updateSql = `UPDATE shop_info SET ${updateFields.join(
          ", "
        )} WHERE accountID = ?`;
        updateValues.push(accountId);

        db.query(updateSql, updateValues, (updateErr, updateResult) => {
          if (updateErr) {
            return res.status(200).json({
              status: "error",
              message: "Failed to update shop",
            });
          }

          res.status(200).json({
            status: "success",
            message: "Shop update successful",
          });
        });
      } else {
        res.status(200).json({
          status: "error",
          message: "No fields to update",
        });
      }
    }
  });
});

router.post(
  "/uploadProfilePicture",
  upload.single("profilePicture"),
  (req, res) => {
    const profilePicture = req.file.filename;
    const { accountId } = req.body;

    const sql =
      "UPDATE personal_info SET profilePicture = ? WHERE accountID = ?";
    db.query(sql, [profilePicture, accountId], (err, result) => {
      if (err) {
        res.status(200).json({
          status: "error",
          message: "Failed to update profile picture",
        });
        return;
      }

      res.status(200).json({
        status: "success",
        message: "Profile picture updated successfully",
      });
    });
  }
);

router.post("/changePassword", (req, res) => {
  const { accountId, currentPassword, newPassword, confirmPassword } = req.body;

  const query = "SELECT password FROM account_info WHERE accountID = ?";
  db.query(query, [accountId], async (err, results) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Database error",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Account not found",
      });
    }

    const fetchedPassword = results[0].password;

    const match = await bcrypt.compare(currentPassword, fetchedPassword);
    if (!match) {
      return res.status(200).json({
        status: "error",
        message: "Incorrect current password",
      });
    }

    if (
      newPassword.length < 8 ||
      !/[A-Za-z]/.test(newPassword) ||
      !/\d/.test(newPassword)
    ) {
      return res.json({
        status: "error",
        message:
          "New password must have at least 8 characters and include both letters and numbers",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.json({
        status: "error",
        message: "New password and confirm password do not match",
      });
    }

    if (currentPassword == confirmPassword) {
      return res.json({
        status: "error",
        message: "You have entered your current password",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updateQuery =
      "UPDATE account_info SET password = ? WHERE accountID = ?";
    db.query(updateQuery, [hashedPassword, accountId], (err, results) => {
      if (err) {
        return res.status(500).json({
          status: "error",
          message: "Database error",
        });
      }
      return res.status(200).json({
        status: "success",
        message: "Password changed successfully",
      });
    });
  });
});

router.post("/changePhone", (req, res) => {
  const { accountId, phone } = req.body;

  if (!accountId || !phone) {
    return res.status(400).json({
      status: "error",
      message: "AccountId and Phone are required.",
    });
  }

  if (phone.length !== 11) {
    return res.json({
      status: "error",
      message: "Phone number must be 11 characters long",
    });
  }

  if (!phone.startsWith("09")) {
    return res.status(200).json({
      status: "error",
      message: "Phone number must start with 09",
    });
  }

  const sqlFetch = "SELECT phone FROM account_info WHERE accountID = ?";
  db.query(sqlFetch, [accountId], (err, results) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Database error",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Account not found.",
      });
    }

    const currentPhone = results[0].phone;

    if (currentPhone === phone) {
      return res.status(200).json({
        status: "error",
        message: "Nothing has changed.",
      });
    }

    const sqlCheckPhone = "SELECT phone FROM account_info WHERE phone = ?";
    db.query(sqlCheckPhone, [phone], (err, phoneResults) => {
      if (err) {
        return res.status(500).json({
          status: "error",
          message: "Database error",
        });
      }

      if (phoneResults.length > 0) {
        return res.status(409).json({
          status: "error",
          message: "Phone number already exists.",
        });
      }

      const sqlUpdate = "UPDATE account_info SET phone = ? WHERE accountID = ?";
      db.query(sqlUpdate, [phone, accountId], (err, updateResults) => {
        if (err) {
          return res.status(500).json({
            status: "error",
            message: "Database error",
          });
        }

        return res.status(200).json({
          status: "success",
          message: "Phone number updated successfully",
        });
      });
    });
  });
});

router.post("/changeEmail", (req, res) => {
  const { accountId, email } = req.body;

  if (!accountId || !email) {
    return res.status(400).json({
      status: "error",
      message: "AccountId and Email are required.",
    });
  }

  const sqlFetch = "SELECT email FROM account_info WHERE accountID = ?";
  db.query(sqlFetch, [accountId], (err, results) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Database error",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Account not found.",
      });
    }

    const currentEmail = results[0].email;

    if (currentEmail === email) {
      return res.status(200).json({
        status: "error",
        message: "Nothing has changed.",
      });
    }

    const sqlCheckEmail = "SELECT email FROM account_info WHERE email = ?";
    db.query(sqlCheckEmail, [email], (err, emailResults) => {
      if (err) {
        return res.status(500).json({
          status: "error",
          message: "Database error",
        });
      }

      if (emailResults.length > 0) {
        return res.status(409).json({
          status: "error",
          message: "Email already exists.",
        });
      }

      const sqlUpdate = "UPDATE account_info SET email = ? WHERE accountID = ?";
      db.query(sqlUpdate, [email, accountId], (err, updateResults) => {
        if (err) {
          return res.status(500).json({
            status: "error",
            message: "Database error",
          });
        }

        return res.status(200).json({
          status: "success",
          message: "Email updated successfully",
        });
      });
    });
  });
});

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

router.post("/addressUpdate", (req, res) => {
  const { accountId, street, barangay, municipality, zipCode } = req.body;

  const fields = { accountId, street, barangay, municipality, zipCode };
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

    if (street && street !== existingPersonalInfo.street) {
      updatedFields.street = street;
      updateRequired = true;
    }
    if (barangay && barangay !== existingPersonalInfo.barangay) {
      updatedFields.barangay = barangay;
      updateRequired = true;
    }
    if (municipality && municipality !== existingPersonalInfo.municipality) {
      updatedFields.municipality = municipality;
      updateRequired = true;
    }
    if (zipCode && zipCode !== existingPersonalInfo.zipCode) {
      updatedFields.zipCode = zipCode;
      updateRequired = true;
    }

    if (!updateRequired) {
      return res.status(200).json({
        status: "success",
        message: "No changes detected in address information",
      });
    }

    const sqlUpdate =
      "UPDATE personal_info SET street=?, barangay=?, municipality=?, zipCode=? WHERE accountID=?";

    db.query(
      sqlUpdate,
      [
        updatedFields.street || existingPersonalInfo.street,
        updatedFields.barangay || existingPersonalInfo.barangay,
        updatedFields.municipality || existingPersonalInfo.municipality,
        updatedFields.zipCode || existingPersonalInfo.zipCode,
        accountId,
      ],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            status: "error",
            message: "Error updating address information",
            error: err,
          });
        }

        res.status(200).json({
          status: "success",
          message: "Address information updated successfully",
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

router.post("/reportProblem", async (req, res) => {
  const { accountId, about, description } = req.body;

  if (!about || !description) {
    return res.status(200).json({
      status: "error",
      message: "About and Description are required fields",
    });
  }

  if (description.length > 255) {
    return res.status(200).json({
      status: "error",
      message: "Description must be 255 characters or less",
    });
  }

  try {
    const sqlFetch = "SELECT * FROM account_info WHERE accountID = ?";
    db.query(sqlFetch, [accountId], (err, result) => {
      if (err) {
        console.error("Error fetching account:", err);
        return res.status(500).json({
          status: "error",
          message: "Database error",
        });
      }

      if (result.length === 0) {
        return res.status(404).json({
          status: "error",
          message: "Account not found",
        });
      }

      const sqlInsert =
        "INSERT INTO report_problem (accountID, about, description) VALUES (?, ?, ?)";
      db.query(sqlInsert, [accountId, about, description], (err, result) => {
        if (err) {
          console.error("Error inserting problem report:", err);
          return res.status(500).json({
            status: "error",
            message: "Database insert error",
          });
        }

        return res.status(200).json({
          status: "success",
          message: "Report problem submitted successfully.",
        });
      });
    });
  } catch (error) {
    console.error("Error reporting problem:", error);
    return res.status(500).json({
      status: "error",
      message: "Error reporting problem",
    });
  }
});

module.exports = router;
