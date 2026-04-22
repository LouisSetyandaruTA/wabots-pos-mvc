const paymentService = require("../services/paymentService");

exports.createPayment = async (req, res) => {
  try {
    const { orderId } = req.params;

    const result = await paymentService.createPayment(orderId);

    res.json({
      success: true,
      token: result.token,
      paymentUrl: result.redirect_url
    });

  } catch (err) {
    console.error("CREATE PAYMENT ERROR:", err); 
    res.status(500).json({ message: err.message });
  }
};

exports.handleMidtransWebhook = async (req, res) => {
  try {
    await paymentService.handleWebhook(req.body);

    res.status(200).json({ message: "Webhook received" });

  } catch (err) {
    console.error("WEBHOOK ERROR:", err);
    res.status(500).json({ message: "Webhook error" });
  }
};