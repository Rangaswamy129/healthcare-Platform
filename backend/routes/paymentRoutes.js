const express = require("express");
const router = express.Router();

const { createCheckoutSession } = require("../controllers/paymentController");

// Test route
router.get("/", (req, res) => {
  res.json({ message: "Payment route working" });
});

// Stripe checkout route
router.post("/create-checkout-session", createCheckoutSession);

module.exports = router;
