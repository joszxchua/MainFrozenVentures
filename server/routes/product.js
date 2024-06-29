const express = require("express");
const multer = require("multer");
const path = require("path");
const db = require("../db");

const router = express.Router();

const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/productImages");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const uploadProduct = multer({
  storage: productStorage,
});

router.post("/addProduct", uploadProduct.single("productImage"), (req, res) => {
  const productImage = req.file ? req.file.filename : null;
  const {
    accountId,
    name,
    brand,
    flavor,
    size,
    description,
    price,
    stock,
    allergens,
  } = req.body;

  const checkSql = "SELECT * FROM product_info WHERE name = ? AND flavor = ?";
  db.query(checkSql, [name, flavor], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Failed to check product:", checkErr);
      return res.status(500).json({
        status: "error",
        message: "Failed to add product",
      });
    }

    if (checkResult.length > 0) {
      return res.status(200).json({
        status: "error",
        message: "Product already exists",
      });
    }

    const insertSql =
      "INSERT INTO product_info (accountID, productImage, name, brand, flavor, size, description, price, stock, allergens) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(
      insertSql,
      [
        accountId,
        productImage,
        name,
        brand,
        flavor,
        size,
        description,
        price,
        stock,
        allergens,
      ],
      (insertErr, insertResult) => {
        if (insertErr) {
          console.error("Failed to insert product:", insertErr);
          return res.status(500).json({
            status: "error",
            message: "Failed to add product",
          });
        }

        res.status(200).json({
          status: "success",
          message: "Product added successfully",
        });
      }
    );
  });
});

module.exports = router;
