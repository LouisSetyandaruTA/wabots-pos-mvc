const express = require("express");

const router = express.Router();

const authMiddleware =
    require("../../middlewares/authMiddleware");

const chatController =
    require("../../controllers/ChatController");

// =========================
// GET SESSIONS
// =========================
router.get(
    "/sessions",
    authMiddleware,
    chatController.getSessions
);

// =========================
// GET DETAIL
// =========================
router.get(
    "/sessions/:id",
    authMiddleware,
    chatController.getSessionDetail
);

// =========================
// TAKE OVER
// =========================
router.put(
    "/sessions/:id/takeover",
    authMiddleware,
    chatController.takeOverSession
);

// =========================
// BACK TO AI
// =========================
router.put(
    "/sessions/:id/ai",
    authMiddleware,
    chatController.backToAI
);

// =========================
// SEND MESSAGE
// =========================
router.post(
    "/sessions/:id/send",
    authMiddleware,
    chatController.sendMessage
);

module.exports = router;