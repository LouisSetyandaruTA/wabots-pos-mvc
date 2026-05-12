const { Order, OrderItem, ProductVariant, Product } = require("../models");
const sequelize = require("../config/database");

exports.getDashboardData = async (businessId) => {

  const totalRevenue = await Order.sum("totalPrice", {
    where: {
      status: "paid",
      businessId
    }
  });

  const totalOrders = await Order.count({
    where: { businessId }
  });

  const pendingOrders = await Order.count({
    where: {
      status: "pending",
      businessId
    }
  });

  const topProductsRaw = await OrderItem.findAll({
    attributes: [
      "variantId",
      [sequelize.fn("SUM", sequelize.col("quantity")), "totalSold"]
    ],
    include: [
      {
        model: Order,
        as: "order",
        attributes: [],
        where: { businessId }
      }
    ],
    group: ["variantId"],
    order: [[sequelize.literal("totalSold"), "DESC"]],
    limit: 5,
    raw: true
  });

  const variantIds = topProductsRaw.map(p => p.variantId);

 const variants = await ProductVariant.findAll({
  where: {
    id: variantIds,
    status: "active"
  },
    include: [
      {
        model: Product,
        as: "Product",
        attributes: ["nama"]
      }
    ],
    raw: true,
    nest: true
  });

  const topProducts = topProductsRaw.map(p => {
    const variant = variants.find(v => v.id === p.variantId);

    return {
      variantId: p.variantId,
      totalSold: Number(p.totalSold || 0),
      variant: variant || null
    };
  });

  // SALES PER DAY (FILTER USER)
  const salesPerDay = await Order.findAll({
    attributes: [
      [
        sequelize.fn(
          "DATE",
          sequelize.fn("CONVERT_TZ", sequelize.col("createdAt"), "+00:00", "+07:00")
        ),
        "date"
      ],
      [sequelize.fn("SUM", sequelize.col("totalPrice")), "total"]
    ],
    where: {
      status: "paid",
      businessId
    },
    group: ["date"],
    order: [["date", "ASC"]],
    raw: true
  });

  return {
    totalRevenue: totalRevenue || 0,
    totalOrders,
    pendingOrders,
    topProducts,
    salesPerDay
  };
};