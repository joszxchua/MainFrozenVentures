const express = require("express");
const db = require("../db");

const router = express.Router();

router.post("/fetchSingleOrder", (req, res) => {
  const { accountId, orderId } = req.body;

  if (!accountId || !orderId) {
    return res.status(400).json({
      status: "error",
      message: "Account ID or Order ID is missing.",
    });
  }

  const fetchSingleOrderSql = `SELECT 
                                  uo.*, 
                                  pi.name, pi.flavor, pi.brand, pi.productImage, 
                                  ps.size,
                                  si.shopName
                                FROM 
                                  user_order AS uo
                                INNER JOIN 
                                  product_info AS pi ON uo.productID = pi.productID
                                INNER JOIN 
                                  product_size AS ps ON uo.sizeID = ps.sizeID
                                INNER JOIN 
                                  shop_info AS si ON pi.accountID = si.accountID
                                WHERE 
                                  uo.accountID = ? AND uo.orderID = ?;`;

  db.query(fetchSingleOrderSql, [accountId, orderId], (err, results) => {
    if (err) {
      console.error("Database fetch error:", err);
      return res.status(500).json({
        status: "error",
        message: "Database fetch error",
      });
    }

    return res.status(200).json({
      status: "success",
      order: results[0],
    });
  });
});

router.post("/fetchOrders", (req, res) => {
  const { accountId } = req.body;

  if (!accountId) {
    return res.status(400).json({
      status: "error",
      message: "Account ID is missing.",
    });
  }

  const fetchOrdersSql = `SELECT 
                                uo.*, 
                                pi.name,  pi.flavor,  pi.brand,  pi.productImage, 
                                ps.size,
                                si.shopName
                          FROM 
                                user_order AS uo
                          INNER JOIN 
                                product_info AS pi ON uo.productID = pi.productID
                          INNER JOIN 
                                product_size AS ps ON uo.sizeID = ps.sizeID
                          INNER JOIN 
                                shop_info AS si ON pi.accountID = si.accountID
                          WHERE 
                                uo.accountID = ?;`;

  db.query(fetchOrdersSql, [accountId], (err, results) => {
    if (err) {
      console.error("Database fetch error:", err);
      return res.status(500).json({
        status: "error",
        message: "Database fetch error",
      });
    }

    return res.status(200).json({
      status: "success",
      order: results,
    });
  });
});

router.post("/placeOrder", async (req, res) => {
  const {
    accountId,
    productId,
    sizeId,
    quantity,
    totalPrice,
    shippingMode,
    orderDate,
    receiveDate,
    status,
    street,
    barangay,
    municipality,
    province,
    zipCode,
  } = req.body;

  const requiredFields = {
    accountId,
    productId,
    sizeId,
    quantity,
    totalPrice,
    shippingMode,
    orderDate,
    receiveDate,
    status,
    street,
    barangay,
    municipality,
    province,
    zipCode,
  };

  for (const [field, value] of Object.entries(requiredFields)) {
    if (!value) {
      return res.status(400).json({
        status: "error",
        message: `Field ${field} is missing.`,
      });
    }
  }

  const insertOrderSql = `
    INSERT INTO user_order (
      accountID, productID, sizeID, quantity, totalPrice, shippingMode, orderDate,
      receiveDate, status, street, barangay, municipality, province, zipCode
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    insertOrderSql,
    [
      accountId,
      productId,
      sizeId,
      quantity,
      totalPrice,
      shippingMode,
      orderDate,
      receiveDate,
      status,
      street,
      barangay,
      municipality,
      province,
      zipCode,
    ],
    (err, results) => {
      if (err) {
        console.error("Database insertion error:", err);
        return res.status(500).json({
          status: "error",
          message: "Database insertion error",
        });
      }

      return res.status(200).json({
        status: "success",
        message: "Order placed successfully",
      });
    }
  );
});

module.exports = router;
