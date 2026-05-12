require("dotenv").config();

const {
    askDeepSeek
} = require("../services/openRouterService");

const {
    extractJsonFromAI
} = require("../utils/aiUtils");

const test = async () => {

    const aiResult = await askDeepSeek(
        "Saya mau beli 2 kopi latte dan 1 burger"
    );

    console.log("RAW AI:");
    console.log(aiResult);

    console.log("\n====================\n");

    const parsed = extractJsonFromAI(aiResult);

    console.log("PARSED JSON:");
    console.log(parsed);
};

test();