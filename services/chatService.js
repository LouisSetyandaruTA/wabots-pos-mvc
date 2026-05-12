const {
    ChatSession,
    ChatMessage,
    Customer
} = require("../models");

// =========================
// GET / CREATE SESSION
// =========================
exports.getOrCreateChatSession =
async ({
    customerId,
    businessId
}) => {

    let session =
        await ChatSession.findOne({
            where: {
                customerId,
                businessId,
                isActive: true
            }
        });

    // =========================
    // CREATE SESSION
    // =========================
    if (!session) {

        session =
            await ChatSession.create({
                customerId,
                businessId,
                mode: "AI",
                isActive: true
            });
    }

    return session;
};

// =========================
// SAVE MESSAGE
// =========================
exports.saveMessage =
async ({
    sessionId,
    sender,
    message
}) => {

    await ChatMessage.create({
        sessionId,
        sender,
        message
    });

    // UPDATE LAST MESSAGE
    await ChatSession.update(
        {
            lastMessage: message
        },
        {
            where: {
                id: sessionId
            }
        }
    );
};

// =========================
// GET SESSION
// =========================
exports.getSessionByCustomer =
async ({
    customerId,
    businessId
}) => {

    return await ChatSession.findOne({
        where: {
            customerId,
            businessId,
            isActive: true
        }
    });
};