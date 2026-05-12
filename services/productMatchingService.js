const stringSimilarity = require("string-similarity");

const {
    Product
} = require("../models");

exports.matchProduct = async (
    businessId,
    itemName
) => {

    const products = await Product.findAll({
        where: {
   businessId,
   status: "active"
}
    });

    if (!products.length) {
        return null;
    }

    const productNames = products.map(
        p => p.nama
    );

    const result =
        stringSimilarity.findBestMatch(
            itemName,
            productNames
        );

    const bestMatch =
        result.bestMatch.target;

    const matchedProduct =
        products.find(
            p => p.nama === bestMatch
        );

    return {
        matchedProduct,
        similarity:
            result.bestMatch.rating
    };
};

exports.matchMultipleProducts = async (
    businessId,
    items
) => {

    const results = [];

    for (const item of items) {

        const matched =
            await exports.matchProduct(
                businessId,
                item.name
            );

        results.push({
            requestedItem: item.name,
            quantity: item.quantity,
            matchedProduct:
                matched?.matchedProduct || null,
            similarity:
                matched?.similarity || 0
        });
    }

    return results;
};