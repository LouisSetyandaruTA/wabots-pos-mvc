require("dotenv").config();

const {
    sequelize
} = require("../models");

const {
    matchMultipleProducts
} = require("../services/productMatchingService");

const test = async () => {

    await sequelize.authenticate();

    const items = [
        {
            name: "green tea",
            quantity: 2
        },
        {
            name: "French Fries",
            quantity: 1
        }
    ];

    const result =
        await matchMultipleProducts(
            "b-teaholic",
            items
        );

    console.log(JSON.stringify(
        result,
        null,
        2
    ));
};

test();