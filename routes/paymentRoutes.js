const express = require("express");
const paypal = require("../config/paypalConfig");
const router = express.Router();

router.post("/create-payment", (req, res) => {
  const paymentJson = {
    intent: "sale",
    payer: { payment_method: "paypal" },
    transactions: [
      {
        amount: { total: req.body.amount, currency: "USD" },
        description: "Payment for goods/services",
      },
    ],
    redirect_urls: {
      return_url: "http://localhost:5000/payment/success",
      cancel_url: "http://localhost:5000/payment/cancel",
    },
  };

  paypal.payment.create(paymentJson, function (error, payment) {
    if (error) {
      console.log(error);
      res.status(500).send("Error creating payment");
    } else {
      // Find the approval URL to redirect the user to PayPal
      const approvalUrl = payment.links.find(
        (link) => link.rel === "approval_url"
      ).href;
      res.json({ approvalUrl });
    }
  });
});
router.get("/success", (req, res) => {
  res.send("Payment was successful!");
});

router.get("/cancel", (req, res) => {
  res.send("Payment was canceled.");
});
module.exports = router;
