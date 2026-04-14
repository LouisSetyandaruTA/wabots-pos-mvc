// const { Order, OrderItem, ProductVariant, sequelize } = require("../models");
// const { Op } = require("sequelize");

// exports.getDashboardData = async () => {

//     // 🔥 SALES PER DAY
// const salesPerDay = await Order.findAll({
//   attributes: [
//     [sequelize.fn("DATE", sequelize.col("createdAt")), "date"],
//     [sequelize.fn("SUM", sequelize.col("totalPrice")), "total"]
//   ],
//   where: {
//     status: "paid"
//   },
//   group: ["date"],
//   order: [["date", "ASC"]]
// });

//   // 🔥 TOTAL REVENUE (PAID)
//   const totalRevenue = await Order.sum("totalPrice", {
//     where: { status: "paid" }
//   });

//   // 🔥 TOTAL ORDER
//   const totalOrders = await Order.count();

//   // 🔥 PENDING
//   const pendingOrders = await Order.count({
//     where: { status: "pending" }
//   });

//   // 🔥 TOP PRODUCT
//   const topProducts = await OrderItem.findAll({
//     attributes: [
//       "variantId",
//       [sequelize.fn("SUM", sequelize.col("quantity")), "totalSold"]
//     ],
//     group: ["variantId"],
//     order: [[sequelize.literal("totalSold"), "DESC"]],
//     limit: 5,
//     include: [
//       {
//         model: ProductVariant,
//         as: "variant"
//       }
//     ]
//   });

//   return {
//     totalRevenue: totalRevenue || 0,
//     totalOrders,
//     pendingOrders,
//     topProducts,
//     salesPerDay
//   };
// };

const { Order, OrderItem, ProductVariant, Product } = require("../models");
const sequelize = require("../config/database");
exports.getDashboardData = async () => {

  const totalRevenue = await Order.sum("totalPrice", {
    where: { status: "paid" }
  });

  const totalOrders = await Order.count();

  const pendingOrders = await Order.count({
    where: { status: "pending" }
  });

  //  STEP 1: AGGREGATE
  const topProductsRaw = await OrderItem.findAll({
    attributes: [
      "variantId",
      [sequelize.fn("SUM", sequelize.col("quantity")), "totalSold"]
    ],
    group: ["variantId"],
    order: [[sequelize.literal("totalSold"), "DESC"]],
    limit: 5,
    raw: true
  });

  //STEP 2: AMBIL VARIANT
  const variantIds = topProductsRaw.map(p => p.variantId);

  const variants = await ProductVariant.findAll({
  where: { id: variantIds },
  include: [
    {
      model: Product,
      attributes: ["nama"]
    }
  ],
  raw: true,
  nest: true 
});

  // 🔥 STEP 3: MERGE
  const topProducts = topProductsRaw.map(p => {
    const variant = variants.find(v => v.id === p.variantId);

    return {
      variantId: p.variantId,
      totalSold: Number(p.totalSold || 0),
      variant: variant || null
    };
  });

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
  where: { status: "paid" },
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