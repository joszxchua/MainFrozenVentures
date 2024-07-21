const express = require("express");
const db = require("../db");

const router = express.Router();

router.post("/updateIsVerified", (req, res) => {
  const { shopId, isVerified } = req.body;

  if (!shopId) {
    return res.status(400).json({
      status: "error",
      message: "shopID is required",
    });
  }

  const updateIsVerifiedSql = `UPDATE shop_info 
                                 SET isVerified = ?
                                 WHERE shopID = ?`;

  db.query(updateIsVerifiedSql, [isVerified, shopId], (err, result) => {
    if (err) {
      console.error("Database update error:", err);
      return res.status(500).json({
        status: "error",
        message: "Database update error",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: "error",
        message: "Shop not found",
      });
    }

    let message;
    if (isVerified === 1) {
      message = "Document has been successfully verified";
    } else if (isVerified === 2) {
      message = "Document has been successfully rejected";
    } else {
      message = "Document status has been updated";
    }

    return res.status(200).json({
      status: "success",
      message,
    });
  });
});

router.post("/documentsFetch", (req, res) => {
  const fetchDocumentsSql = `SELECT *
                                FROM shop_info si
                            INNER JOIN 
                                account_info ai ON si.accountID = ai.accountID
                            INNER JOIN 
                                personal_info pi ON si.accountID = pi.accountID`;

  db.query(fetchDocumentsSql, (err, results) => {
    if (err) {
      console.error("Database fetch error:", err);
      return res.status(500).json({
        status: "error",
        message: "Database fetch error",
      });
    }

    return res.status(200).json({
      status: "success",
      document: results,
    });
  });
});

router.post("/fetchAllAccounts", (req, res) => {
  const fetchAllAccountsSql = `SELECT *
                                   FROM account_info ai
                               INNER JOIN 
                                   personal_info pi ON ai.accountID = pi.accountID`;

  db.query(fetchAllAccountsSql, (err, results) => {
    if (err) {
      console.error("Database fetch error:", err);
      return res.status(500).json({
        status: "error",
        message: "Database fetch error",
      });
    }

    return res.status(200).json({
      status: "success",
      users: results,
    });
  });
});

module.exports = router;
