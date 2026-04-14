const { Op, fn, col, literal } = require("sequelize");
const { Order, OrderItem, ProductVariant, Product, Customer} = require("../models");

const getSummaryReport = async ({ startDate, endDate, groupBy }) => {
  // 1. SUMMARY
const summary = await Order.findAll({
  attributes: [
    [fn("SUM", col("totalPrice")), "totalRevenue"],
    [fn("COUNT", col("id")), "totalOrders"],
    [
  literal("COALESCE(SUM(totalPrice) / NULLIF(COUNT(id), 0), 0)"),
  "avgOrderValue"
]
  ],
  where: {
    status: "paid",
createdAt: {
  [Op.between]: [
    startDate + " 00:00:00",
    endDate + " 23:59:59"
  ]
}
  },
  raw: true
});

  // 2. GROUPING FORMAT
  let format = "%Y-%m-%d";
  if (groupBy === "month") format = "%Y-%m";
  if (groupBy === "week") format = "%Y-%u";

  // 3. TRENDS
const trends = await Order.findAll({
  attributes: [
    [
      fn(
        "DATE_FORMAT",
        fn("CONVERT_TZ", col("createdAt"), "+00:00", "+07:00"),
        format
      ),
      "period"
    ],
    [fn("SUM", col("totalPrice")), "revenue"],
    [fn("COUNT", col("id")), "orders"]
  ],
  where: {
    status: "paid",
    createdAt: {
      [Op.between]: [
        startDate + " 00:00:00",
        endDate + " 23:59:59"
      ]
    }
  },
  group: ["period"],
  order: [[literal("period"), "ASC"]],
  raw: true
});

  // 4. TOP PRODUCTS
const topProducts = await OrderItem.findAll({
  attributes: [
    [col("variant.Product.nama"), "productName"],
    [fn("SUM", col("quantity")), "totalSold"],
    [fn("SUM", col("subtotal")), "revenue"]
  ],
  include: [
    {
      model: ProductVariant,
      as: "variant",
      include: [
        {
          model: Product
        }
      ]
    },
    {
      model: Order,
      as: "order",
      where: {
        status: "paid",
createdAt: {
  [Op.between]: [
    startDate + " 00:00:00",
    endDate + " 23:59:59"
  ]
}
      }
    }
  ],
  group: ["variant.Product.nama"],
  order: [[literal("totalSold"), "DESC"]],
  limit: 10,
  raw: true
});
const transactions = await Order.findAll({
  where: {
    status: "paid",
    createdAt: {
      [Op.between]: [
        startDate + " 00:00:00",
        endDate + " 23:59:59"
      ]
    }
  },
  include: [
    {
      model: Customer,
      as: "customer",
      attributes: ["name", "phoneNumber"]
    },
    {
      model: OrderItem,
      as: "items",
      include: [
        {
          model: ProductVariant,
          as: "variant",
          include: [
            {
              model: Product,
              attributes: ["nama"]
            }
          ]
        }
      ]
    }
  ],
  order: [["createdAt", "DESC"]]
});

  return {
    summary: summary[0],
    trends,
    topProducts,
     transactions 
  };
};

module.exports = { getSummaryReport };