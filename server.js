const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "FraudSentinel backend is running 🚀"
  });
});

app.post("/api/analyze-payment", async (req, res) => {
  try {
    const payment = req.body;

    console.log("Payment received:");
    console.log(payment);

    // RocketRide processing will go here
    // after the public backend is working.

    res.json({
      success: true,
      message: "Payment received successfully",
      payment: payment
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`FraudSentinel backend running on port ${PORT}`);
});
