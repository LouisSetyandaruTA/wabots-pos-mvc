const { Business } = require("../models");

exports.getBusiness = async (businessId) => {

  return await Business.findByPk(
    businessId
  );
};

exports.updateBusiness = async (
  businessId,
  payload
) => {

  const business =
    await Business.findByPk(
      businessId
    );

  if (!business) {
    throw new Error(
      "Business tidak ditemukan"
    );
  }

  await business.update({

    name: payload.name,

    description:
      payload.description,

    address:
      payload.address,

    phone:
      payload.phone,

    openHours:
      payload.openHours,

    faq:
      payload.faq

  });

  return business;
};