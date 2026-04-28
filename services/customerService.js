const { Customer } = require("../models");

exports.getAll = async (businessId) => {
  return await Customer.findAll({
    where: { businessId }
  });
};

exports.create = async (data, businessId) => {
  return await Customer.create({
    ...data,
    businessId
  });
};