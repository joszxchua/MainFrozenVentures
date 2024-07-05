const express = require("express");
const db = require("../db");

const router = express.Router();

router.post("/addToCart", async (req, res) => {
    const { accountId, productId, sizeId, quantity } = req.body;
  
    
  });
  

module.exports = router;