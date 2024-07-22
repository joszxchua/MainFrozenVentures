const express = require("express");
const multer = require("multer");
const path = require("path");
const db = require("../db");

const router = express.Router();

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

    const sql = "UPDATE shop_info SET shopDocument = ? WHERE accountID = ?";
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

router.post("/updateShopAddress", (req, res) => {
  const { accountId, street, barangay, municipality, province, zipCode } =
    req.body;

  const sql = `
    UPDATE shop_info 
    SET street = ?, barangay = ?, municipality = ?, province = ?, zipCode = ? 
    WHERE accountID = ?`;

  db.query(
    sql,
    [street, barangay, municipality, province, zipCode, accountId],
    (err, result) => {
      if (err) {
        res.status(200).json({
          status: "error",
          message: "Failed to update shop address",
        });
        return;
      }

      res.status(200).json({
        status: "success",
        message: "Shop address updated successfully",
      });
    }
  );
});

module.exports = router;
