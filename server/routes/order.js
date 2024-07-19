const express = require("express");
const db = require("../db");

const router = express.Router();

router.post("/sellerFetchOrders", (req,res) => {
  const { accountId } = req.body;

  if (!accountId) {
    return res.status(400).json({
      status: "error",
      message: "Account ID is missing",
    });
  }

  const fetchSingleOrderSql = `SELECT 
                                  uo.*, 
                                  ai.*,
                                  pei.*,
                                  pi.name, pi.flavor, pi.brand, pi.productImage, 
                                  ps.size,
                                  si.shopName
                                FROM 
                                  user_order AS uo
                                INNER JOIN 
                                  account_info AS ai ON uo.accountID = ai.accountID
                                INNER JOIN 
                                  personal_info AS pei ON uo.accountID = pei.accountID
                                INNER JOIN 
                                  product_info AS pi ON uo.productID = pi.productID
                                INNER JOIN 
                                  product_size AS ps ON uo.sizeID = ps.sizeID
                                INNER JOIN 
                                  shop_info AS si ON pi.accountID = si.accountID
                                WHERE 
                                  pi.accountID = ?`;

  db.query(fetchSingleOrderSql, [accountId], (err, results) => {
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
})

router.post("/cancelOrder", (req, res) => {
  const { accountId, orderId, reason } = req.body;

  if (!accountId || !orderId) {
    return res.status(400).json({
      status: "error",
      message: "One of the IDs is missing",
    });
  }

  const updateOrderSql = `
    UPDATE user_order
    SET status = "Cancelled", cancelReason = ?
    WHERE accountID = ? AND orderID = ?
  `;

  db.query(updateOrderSql, [reason, accountId, orderId], (err, results) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Database update error",
      });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({
        status: "error",
        message: "Order not found.",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Order has been successfully cancelled",
    });
  });
});

router.post("/reviewProduct", (req, res) => {
  const { accountId, orderId, productId, sizeId, rating, reviewText } =
    req.body;

  if (!accountId || !orderId || !productId || !sizeId) {
    return res.status(400).json({
      status: "error",
      message: "One of the IDs is missing",
    });
  }

  const updateOrderSql = `
    UPDATE user_order
    SET isReviewed = 1
    WHERE orderID = ?
  `;

  db.query(updateOrderSql, [orderId], (err, results) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Database update error",
      });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({
        status: "error",
        message: "Order not found.",
      });
    }

    const insertReviewSql = `
      INSERT INTO review_product (accountID, orderID, productID, sizeID, rating, reviewText)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
      insertReviewSql,
      [accountId, orderId, productId, sizeId, rating, reviewText],
      (err, results) => {
        if (err) {
          return res.status(500).json({
            status: "error",
            message: "Database insert error",
          });
        }

        return res.status(200).json({
          status: "success",
          message: "Review has been successfully submitted",
        });
      }
    );
  });
});

router.post("/receiveOrder", (req, res) => {
  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({
      status: "error",
      message: "Order ID is missing.",
    });
  }

  const updateOrderStatusSql = `
    UPDATE user_order
    SET status = 'Received'
    WHERE orderID = ?
  `;

  db.query(updateOrderStatusSql, [orderId], (err, results) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Database update error",
      });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({
        status: "error",
        message: "Order not found.",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Order status updated successfully",
    });
  });
});

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
                                  ai.*,
                                  pei.*,
                                  pi.name, pi.flavor, pi.brand, pi.productImage, 
                                  ps.size,
                                  si.shopName
                                FROM 
                                  user_order AS uo
                                INNER JOIN 
                                  account_info AS ai ON uo.accountID = ai.accountID
                                INNER JOIN 
                                  personal_info AS pei ON uo.accountID = pei.accountID
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
