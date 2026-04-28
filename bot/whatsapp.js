const { Customer } = require("../models");

client.on("message", async (msg) => {
  const phone = msg.from.replace("@c.us", "");

  // 🔥 HARUS ADA mapping businessId
  const businessId = "HARDCODE_SEMENTARA"; // nanti dari nomor WA

  let customer = await Customer.findOne({
    where: {
      phoneNumber: phone,
      businessId
    }
  });

  if (!customer) {
    customer = await Customer.create({
      name: "Customer WA",
      phoneNumber: phone,
      businessId
    });
  }

  console.log("Customer:", customer.name);
});