const express = require("express");
const db = require("../db");

const router = express.Router();

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

module.exports = router;
