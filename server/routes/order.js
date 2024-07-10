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
    orderDate,
    receiveDate,
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
    orderDate,
    receiveDate,
    street,
    barangay,
    municipality,
    province,
    zipCode,
  };

  for (const [field, value] of Object.entries(requiredFields)) {
    if (!value) {
      return res.status(200).json({
        status: "error",
        message: `Field ${field} is missing.`,
      });
    }
  }

  try {
    // Place your order placement logic here
    // e.g., saving order details to the database

    return res.status(200).json({
      status: "success",
      message: "Order placed successfully!",
    });
  } catch (error) {
    console.error("Error placing order:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error. Please try again later.",
    });
  }
});

module.exports = router;
