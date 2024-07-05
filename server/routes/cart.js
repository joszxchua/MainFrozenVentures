const express = require("express");
const db = require("../db");

const router = express.Router();

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
