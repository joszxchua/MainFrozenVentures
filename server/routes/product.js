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
      "INSERT INTO product_info (accountID, productImage, name, brand, flavor, description, allergens) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.query(
      insertSql,
      [accountId, productImage, name, brand, flavor, description, allergens],
      (insertErr, insertResult) => {
        if (insertErr) {
          console.error("Failed to insert product:", insertErr);
          return res.status(500).json({
            status: "error",
            message: "Failed to add product",
          });
        }

        const productID = insertResult.insertId;
        const insertSizeSql =
          "INSERT INTO product_size (productID, size, price, stock) VALUES (?, ?, ?, ?)";
        db.query(
          insertSizeSql,
          [productID, size, price, stock],
          (sizeErr, sizeResult) => {
            if (sizeErr) {
              console.error("Failed to insert product size:", sizeErr);
              return res.status(500).json({
                status: "error",
                message: "Failed to add product size",
              });
            }

            return res.status(200).json({
              status: "success",
              message: "Product added successfully",
            });
          }
        );
      }
    );
  });
});

router.post("/sellerProductFetch", (req, res) => {
  const { accountId } = req.body;

  if (!accountId) {
    return res.json({
      status: 0,
      message: "Account ID is required",
    });
  }

  const sql = `SELECT pi.*, COUNT(ps.size) AS totalSizes, SUM(ps.stock) AS totalStock
              FROM product_info pi
              LEFT JOIN product_size ps ON pi.productID = ps.productID
              WHERE pi.accountID = ?
              GROUP BY pi.productID;`;

  db.query(sql, [accountId], (err, results) => {
    if (err) {
      return res.json({ status: 0, message: "Database error", error: err });
    }

    if (results.length === 0) {
      return res.json({
        status: 0,
        message: "No products found for the provided account ID",
      });
    }

    return res.json({
      status: 1,
      message: "Products information fetched successfully",
      products: results,
    });
  });
});

router.post("/productFetch", (req, res) => {
  const { accountId, productId } = req.body;

  if (!accountId || !productId) {
    return res.json({
      status: 0,
      message: "Account and Product ID is required",
    });
  }

  const sql = `SELECT pi.*, COUNT(ps.size) AS totalSizes, SUM(ps.stock) AS totalStock
              FROM product_info pi
              LEFT JOIN product_size ps ON pi.productID = ps.productID
              WHERE pi.accountID = ? AND  pi.productID = ?
              GROUP BY pi.productID;`;

  db.query(sql, [accountId, productId], (err, results) => {
    if (err) {
      return res.json({ status: 0, message: "Database error", error: err });
    }

    if (results.length === 0) {
      return res.json({
        status: 0,
        message: "No products found for the provided account ID",
      });
    }

    return res.json({
      status: 1,
      message: "Products information fetched successfully",
      product: results[0],
    });
  });
});

router.post("/productSizesFetch", (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    return res.json({
      status: 0,
      message: "Product ID is required",
    });
  }

  const sql = `SELECT *
              FROM product_size
              WHERE productID = ?
              GROUP BY productID;`;

  db.query(sql, [productId], (err, results) => {
    if (err) {
      return res.json({ status: 0, message: "Database error", error: err });
    }

    if (results.length === 0) {
      return res.json({
        status: 0,
        message: "No products found for the provided account ID",
      });
    }

    return res.json({
      status: 1,
      message: "Products information fetched successfully",
      products: results,
    });
  });
});

module.exports = router;
