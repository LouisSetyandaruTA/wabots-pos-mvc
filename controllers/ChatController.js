const {
    ChatSession,
    ChatMessage,
    Customer
} = require("../models");

const whatsappService =
    require("../services/whatsappService");

// =========================
// GET ALL SESSIONS
// =========================
exports.getSessions =
    async (req, res) => {

        try {

            const sessions =
                await ChatSession.findAll({

                    where: {
                        businessId:
                            req.user.businessId
                    },

                    include: [
                        {
                            model: Customer,
                            as: "customer"
                        }
                    ],

                    order: [
                        ["needAdmin", "DESC"],
                        ["updatedAt", "DESC"]
                    ]
                });

            res.json({
                success: true,
                data: sessions
            });

        } catch (err) {

            console.error(err);

            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    };

// =========================
// GET SESSION DETAIL
// =========================
exports.getSessionDetail =
    async (req, res) => {

        try {

            const messages =
                await ChatMessage.findAll({

                    where: {
                        sessionId:
                            req.params.id
                    },

                    order: [
                        ["createdAt", "ASC"],
                        ["id", "ASC"]
                    ]
                });

            res.json({
                success: true,
                data: messages
            });

        } catch (err) {

            console.error(err);

            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    };

// =========================
// TAKE OVER
// =========================
exports.takeOverSession =
async (req, res) => {

    try {

        const session =
            await ChatSession.findByPk(
                req.params.id,
                {
                    include: [
                        {
                            model: Customer,
                            as: "customer"
                        }
                    ]
                }
            );

        await ChatSession.update(
            {
                mode: "HUMAN",
                needAdmin: false
            },
            {
                where: {
                    id: req.params.id
                }
            }
        );

        // =========================
        // KIRIM KE WA
        // =========================
        await whatsappService.sendWhatsAppMessage(

            session.customer.phoneNumber,

`Admin telah bergabung ke percakapan.

Sekarang Anda berbicara langsung dengan customer service.`
        );

        res.json({
            success: true
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
// =========================
// BACK TO AI
// =========================
exports.backToAI =
async (req, res) => {

    try {

        const session =
            await ChatSession.findByPk(
                req.params.id,
                {
                    include: [
                        {
                            model: Customer,
                            as: "customer"
                        }
                    ]
                }
            );

        await ChatSession.update(
            {
                mode: "AI",
                needAdmin: false
            },
            {
                where: {
                    id: req.params.id
                }
            }
        );

        // =========================
        // KIRIM KE WA
        // =========================
        await whatsappService.sendWhatsAppMessage(

            session.customer.phoneNumber,

`Percakapan telah dikembalikan ke AI Assistant.

Silakan lanjutkan pertanyaan Anda.`
        );

        res.json({
            success: true
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// =========================
// SEND MESSAGE
// =========================
exports.sendMessage =
    async (req, res) => {

        try {

            const session =
                await ChatSession.findByPk(
                    req.params.id,
                    {
                        include: [
                            {
                                model: Customer,
                                as: "customer"
                            }
                        ]
                    }
                );

            if (!session) {

                return res.status(404).json({
                    success: false,
                    message: "Session tidak ditemukan"
                });
            }

            const message =
                req.body.message;

            // =========================
            // SIMPAN KE DATABASE
            // =========================
            const newMessage =
                await ChatMessage.create({

                    sessionId: session.id,

                    sender: "ADMIN",

                    message
                });

            // =========================
            // UPDATE LAST MESSAGE
            // =========================
            await ChatSession.update(
                {
                    lastMessage: message
                },
                {
                    where: {
                        id: session.id
                    }
                }
            );

            // =========================
            // KIRIM KE WHATSAPP
            // =========================
            const phone =
                session.customer.phoneNumber;

            await whatsappService.sendWhatsAppMessage(
                phone,
                `Admin:\n${message}`
            );

            res.json({
                success: true,
                data: newMessage
            });

        } catch (err) {

            console.error(err);

            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    };