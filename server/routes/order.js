const express = require("express");
const db = require("../db");

const router = express.Router();

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
