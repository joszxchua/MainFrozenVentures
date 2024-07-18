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

router.post("/deleteProduct", (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    return res.json({
      status: 0,
      message: "Product ID is required",
    });
  }

  const sql = `UPDATE product_info SET isDeleted = 1 WHERE productID = ?`;

  db.query(sql, [productId], (err, result) => {
    if (err) {
      return res.json({ status: 0, message: "Database error", error: err });
    }

    if (result.affectedRows === 0) {
      return res.json({
        status: 0,
        message: "No product found with the provided product ID",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Product deleted successfully",
    });
  });
});

router.post(
  "/editProduct",
  uploadProduct.single("productImage"),
  (req, res) => {
    const productImage = req.file ? req.file.filename : null;
    const { productId, name, brand, flavor, description, allergens } = req.body;

    const fieldsToUpdate = {
      productImage,
      name,
      brand,
      flavor,
      description,
      allergens,
    };

    const updates = [];
    const values = [];

    Object.keys(fieldsToUpdate).forEach((field) => {
      if (fieldsToUpdate[field]) {
        updates.push(`${field} = ?`);
        values.push(fieldsToUpdate[field]);
      }
    });

    if (updates.length === 0) {
      return res.status(200).json({
        status: "error",
        message: "Nothing to update",
      });
    }

    values.push(productId);

    const updateSql = `UPDATE product_info SET ${updates.join(
      ", "
    )} WHERE productID = ?`;

    db.query(updateSql, values, (updateErr, updateResult) => {
      if (updateErr) {
        console.error("Failed to update product:", updateErr);
        return res.status(200).json({
          status: "error",
          message: "Failed to update product",
        });
      }

      return res.status(200).json({
        status: "success",
        message: "Product updated successfully",
      });
    });
  }
);

router.post("/sellerProductFetch", (req, res) => {
  const { accountId } = req.body;

  if (!accountId) {
    return res.json({
      status: 0,
      message: "Account ID is required",
    });
  }

  const sql = `SELECT 
                pi.*, COUNT(ps.size) AS totalSizes, 
                SUM(ps.stock) AS totalStock
              FROM 
                product_info pi
              LEFT JOIN 
                product_size ps ON pi.productID = ps.productID
              WHERE 
                pi.accountID = ? AND pi.isDeleted = 0 AND ps.isDeleted = 0 
              GROUP BY 
                pi.productID;`;

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
  const { productId } = req.body;

  if (!productId) {
    return res.json({
      status: 0,
      message: "Product ID is required",
    });
  }

  const sql = `SELECT 
                pi.*, COUNT(ps.size) AS totalSizes, 
                SUM(ps.stock) AS totalStock, 
                IFNULL(ROUND(AVG(rp.rating), 2), 0) AS avgRating,
                si.shopName
              FROM 
                product_info pi
              LEFT JOIN 
                product_size ps ON pi.productID = ps.productID 
              LEFT JOIN 
                review_product rp ON pi.productID = rp.productID
              INNER JOIN 
                shop_info si ON pi.accountID = si.accountID
              WHERE 
                pi.productID = ? AND pi.isDeleted = 0
              GROUP BY 
                pi.productID;`;

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
              WHERE productID = ? AND isDeleted = 0;`;

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

router.post("/productRestock", (req, res) => {
  const { sizeId, stock } = req.body;

  if (!sizeId) {
    return res.status(500).json({
      status: "error",
      message: "Size ID is required",
    });
  }

  if (!stock) {
    return res.status(200).json({
      status: "error",
      message: "Invalid stock value",
    });
  }

  const stockToAdd = Number(stock);

  const selectSql = `SELECT stock FROM product_size WHERE sizeID = ? AND isDeleted = 0`;
  db.query(selectSql, [sizeId], (selectErr, selectResult) => {
    if (selectErr) {
      return res.json({
        status: 0,
        message: "Database error",
        error: selectErr,
      });
    }

    if (selectResult.length === 0) {
      return res.json({
        status: 0,
        message: "No product size found with the provided size ID",
      });
    }

    const currentStock = Number(selectResult[0].stock);
    const newStock = currentStock + stockToAdd;

    const updateSql = `UPDATE product_size SET stock = ? WHERE sizeID = ? AND isDeleted = 0`;
    db.query(updateSql, [newStock, sizeId], (updateErr, updateResult) => {
      if (updateErr) {
        return res.json({
          status: 0,
          message: "Database error",
          error: updateErr,
        });
      }

      return res.status(200).json({
        status: "success",
        message: "Stock updated successfully",
      });
    });
  });
});

router.post("/deleteSize", (req, res) => {
  const { sizeId } = req.body;

  if (!sizeId) {
    return res.json({
      status: 0,
      message: "Size ID is required",
    });
  }

  const sql = `UPDATE product_size SET isDeleted = 1 WHERE sizeID = ?`;

  db.query(sql, [sizeId], (err, result) => {
    if (err) {
      return res.json({ status: 0, message: "Database error", error: err });
    }

    if (result.affectedRows === 0) {
      return res.json({
        status: 0,
        message: "No product found with the provided product ID",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Size deleted successfully",
    });
  });
});

router.post("/addProductSize", (req, res) => {
  const { productId, size, price, stock } = req.body;

  if (!productId) {
    return res.json({
      status: 0,
      message: "Product ID is required",
    });
  }

  if (!size || !price || !stock) {
    return res.status(200).json({
      status: "error",
      message: "Size, price, and stock cannot be empty",
    });
  }

  const checkSizeSql = `SELECT *
                        FROM product_size
                        WHERE productID = ? AND size = ?`;

  db.query(checkSizeSql, [productId, size], (err, results) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Database query error",
      });
    }

    if (results.length > 0) {
      return res.status(200).json({
        status: "error",
        message: "Size already exists for this product",
      });
    }

    const insertSizeSql = `INSERT INTO product_size (productID, size, price, stock)
                           VALUES (?, ?, ?, ?)`;

    db.query(insertSizeSql, [productId, size, price, stock], (err, results) => {
      if (err) {
        return res.status(500).json({
          status: "error",
          message: "Database insertion error",
        });
      }

      return res.status(200).json({
        status: "success",
        message: "Product size added successfully",
      });
    });
  });
});

router.post("/productShopFetch", (req, res) => {
  const { userRole } = req.body;

  if (!userRole) {
    return res.status(500).json({
      status: "error",
      message: "User role is required",
    });
  }

  const fetchProductsSql = `SELECT 
                                pi.*,
                                COUNT(ps.size) AS totalSizes, 
                                SUM(ps.stock) AS totalStock,
                                MIN(ps.price) AS lowestPrice,
                                IFNULL(ROUND(AVG(rp.rating), 2), 0) AS avgRating,
                                s.shopName, 
                                a.userRole
                            FROM 
                                product_info pi
                            LEFT JOIN 
                                product_size ps ON pi.productID = ps.productID AND ps.isDeleted = 0
                            LEFT JOIN 
                                review_product rp ON pi.productID = rp.productID
                            INNER JOIN 
                                shop_info s ON pi.accountID = s.accountID 
                            INNER JOIN 
                                account_info a ON s.accountID = a.accountID 
                            WHERE 
                                a.userRole = ? AND pi.isDeleted = 0 
                            GROUP BY 
                                pi.productID, s.shopName, a.userRole;`;

  db.query(fetchProductsSql, [userRole], (err, results) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Database query error",
      });
    }

    return res.status(200).json({
      status: "success",
      data: results,
    });
  });
});

module.exports = router;
