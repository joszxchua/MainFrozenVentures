const express = require("express");
const db = require("../db");

const router = express.Router();

router.post("/updateQuantity", async (req, res) => {
  const { accountId, cartId, quantity } = req.body;

  if (!accountId) {
    return res.status(400).json({
      status: "error",
      message: "Missing accountID",
    });
  }

  if (!cartId || !quantity) {
    return res.status(400).json({
      status: "error",
      message: "Missing cartID or quantity",
    });
  }

  const updateQuantitySql =
    "UPDATE user_cart SET quantity = ? WHERE cartID = ? AND  accountID = ?";

  db.query(updateQuantitySql, [quantity, cartId, accountId], (err, results) => {
    if (err) {
      console.error("Error updating quantity:", err);
      return res.status(500).json({
        status: "error",
        message: "Database update error",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Quantity updated successfully",
    });
  });
});

router.post("/removeFromCart", async (req, res) => {
  const { accountId, cartId } = req.body;

  if (!accountId || !cartId) {
    return res.status(400).json({
      status: "error",
      message: "Missing accountID and cartID",
    });
  }

  const removeItemSql = "DELETE FROM user_cart WHERE accountID = ? AND cartID = ?";

  db.query(removeItemSql, [accountId, cartId], (err, results) => {
    if (err) {
      console.error("Error removing item:", err);
      return res.status(500).json({
        status: "error",
        message: "Database delete error",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Product removed successfully",
    });
  });
});

router.post("/cartItemFetch", async (req, res) => {
  const { accountId } = req.body;

  if (!accountId) {
    return res.status(400).json({
      status: "error",
      message: "Missing accountID",
    });
  }

  const cartItemFetchSql = `
      SELECT DISTINCT uc.cartID, uc.accountID, uc.productID, uc.sizeID, uc.quantity, 
             ps.size, ps.price, ps.stock, 
             pi.name, pi.description, pi.flavor, pi.brand, pi.productImage
      FROM user_cart uc
      INNER JOIN product_size ps ON uc.productID = ps.productID AND uc.sizeID = ps.sizeID
      INNER JOIN product_info pi ON ps.productID = pi.productID
      WHERE uc.accountID = ?`;

  db.query(cartItemFetchSql, [accountId], (err, results) => {
    if (err) {
      console.error("Error fetching cart:", err);
      return res.status(500).json({
        status: "error",
        message: "Database fetch error",
      });
    }

    return res.status(200).json({
      status: 1,
      cart: results,
    });
  });
});

router.post("/addToCart", async (req, res) => {
  const { accountId, productId, sizeId, quantity } = req.body;

  const values = { accountId, productId, sizeId, quantity };
  let hasEmptyValues = false;

  for (const key in values) {
    if (!values[key]) {
      hasEmptyValues = true;
      break;
    }
  }

  if (hasEmptyValues) {
    return res.status(400).json({
      status: "error",
      message: "Missing required fields",
    });
  }

  const checkIfExistsSql =
    "SELECT * FROM user_cart WHERE accountId = ? AND productId = ? AND sizeId = ?";

  db.query(checkIfExistsSql, [accountId, productId, sizeId], (err, results) => {
    if (err) {
      console.error("Error checking if record exists:", err);
      return res.status(500).json({
        status: "error",
        message: "Database error",
      });
    }

    if (results.length > 0) {
      const updateSql =
        "UPDATE user_cart SET quantity = quantity + ? WHERE accountId = ? AND productId = ? AND sizeId = ?";

      db.query(
        updateSql,
        [quantity, accountId, productId, sizeId],
        (updateErr, updateResult) => {
          if (updateErr) {
            console.error("Error updating quantity:", updateErr);
            return res.status(500).json({
              status: "error",
              message: "Database update error",
            });
          }

          return res.status(200).json({
            status: "success",
            message: "Cart updated successfully",
          });
        }
      );
    } else {
      const insertSql =
        "INSERT INTO user_cart (accountId, productId, sizeId, quantity) VALUES (?, ?, ?, ?)";

      db.query(
        insertSql,
        [accountId, productId, sizeId, quantity],
        (insertErr, insertResult) => {
          if (insertErr) {
            console.error("Error inserting into user_cart:", insertErr);
            return res.status(500).json({
              status: "error",
              message: "Database insert error",
            });
          }

          return res.status(200).json({
            status: "success",
            message: "Added to cart successfully",
          });
        }
      );
    }
  });
});

module.exports = router;
