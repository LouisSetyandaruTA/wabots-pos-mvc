const { Op, fn, col, literal } = require("sequelize");
const {
  Order,
  OrderItem,
  ProductVariant,
  Product,
  Customer,
} = require("../models");

const getSummaryReport = async ({
  startDate,
  endDate,
  groupBy,
  businessId,
}) => {
  // 1. SUMMARY
  const summaryResult = await Order.findAll({
    attributes: [
      [fn("SUM", col("totalPrice")), "totalRevenue"],
      [fn("COUNT", col("id")), "totalOrders"],
      [
        literal("COALESCE(SUM(totalPrice) / NULLIF(COUNT(id), 0), 0)"),
        "avgOrderValue",
      ],
    ],
    where: {
      fulfillmentStatus: "completed",
      businessId,
      createdAt: {
        [Op.between]: [startDate + " 00:00:00", endDate + " 23:59:59"],
      },
    },
    raw: true,
  });

  const summary = summaryResult[0];

  const pendingOrders = await Order.count({
    where: {
      businessId,
      status: "pending",
      createdAt: {
        [Op.between]: [startDate + " 00:00:00", endDate + " 23:59:59"],
      },
    },
  });

  const paidOrders = await Order.count({
    where: {
      businessId,
      status: "paid",
      createdAt: {
        [Op.between]: [startDate + " 00:00:00", endDate + " 23:59:59"],
      },
    },
  });

  const readyPickupOrders = await Order.count({
    where: {
      businessId,
      fulfillmentStatus: "ready_pickup",
      createdAt: {
        [Op.between]: [startDate + " 00:00:00", endDate + " 23:59:59"],
      },
    },
  });

  const shippingOrders = await Order.count({
    where: {
      businessId,
      fulfillmentStatus: "shipping",
      createdAt: {
        [Op.between]: [startDate + " 00:00:00", endDate + " 23:59:59"],
      },
    },
  });

  const completedOrders = await Order.count({
    where: {
      businessId,
      fulfillmentStatus: "completed",
      createdAt: {
        [Op.between]: [startDate + " 00:00:00", endDate + " 23:59:59"],
      },
    },
  });

  summary.pendingOrders = pendingOrders;
  summary.paidOrders = paidOrders;
  summary.readyPickupOrders = readyPickupOrders;
  summary.shippingOrders = shippingOrders;
  summary.completedOrders = completedOrders;

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
          format,
        ),
        "period",
      ],
      [fn("SUM", col("totalPrice")), "revenue"],
      [fn("COUNT", col("id")), "orders"],
    ],
    where: {
      fulfillmentStatus: "completed",
      businessId,
      createdAt: {
        [Op.between]: [startDate + " 00:00:00", endDate + " 23:59:59"],
      },
    },
    group: ["period"],
    order: [[literal("period"), "ASC"]],
    raw: true,
  });

  // 4. TOP PRODUCTS
  const topProducts = await OrderItem.findAll({
    attributes: [
      [col("variant->product.nama"), "productName"],
      [fn("SUM", col("quantity")), "totalSold"],
      [fn("SUM", col("subtotal")), "revenue"],
    ],

    include: [
      {
        model: ProductVariant,
        as: "variant",

        attributes: [],

        include: [
          {
            model: Product,
            as: "product",

            attributes: [],

            where: {
              businessId,
              status: "active",
            },
          },
        ],
      },

      {
        model: Order,
        as: "order",

        attributes: [],

        where: {
          fulfillmentStatus: "completed",
          businessId,
          createdAt: {
            [Op.between]: [startDate + " 00:00:00", endDate + " 23:59:59"],
          },
        },
      },
    ],

    group: ["variant->product.id", "variant->product.nama"],

    order: [[literal("totalSold"), "DESC"]],

    limit: 10,
    raw: true,
  });
  const transactions = await Order.findAll({
    where: {
      fulfillmentStatus: "completed",
      businessId,
      createdAt: {
        [Op.between]: [startDate + " 00:00:00", endDate + " 23:59:59"],
      },
    },
    include: [
      {
        model: Customer,
        as: "customer",
        attributes: ["name", "phoneNumber"],
      },
      {
        model: OrderItem,
        as: "items",
        include: [
          {
            model: ProductVariant,
            as: "variant",
            where: {
              businessId,
              status: "active",
            },
            include: [
              {
                model: Product,
                as: "product",
                attributes: ["nama"],
                where: {
                  businessId,
                  status: "active",
                },
              },
            ],
          },
        ],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  const ongoingOrders = await Order.findAll({
    where: {
      businessId,
      status: "paid",
      fulfillmentStatus: {
        [Op.ne]: "completed",
      },
    },
    include: [
      {
        model: Customer,
        as: "customer",
        attributes: ["name", "phoneNumber"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  return {
    summary: summary,
    trends,
    topProducts,
    transactions,
    ongoingOrders,
  };
};

module.exports = { getSummaryReport };
