const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ChatMessage = sequelize.define(
  "ChatMessage",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },

    sessionId: {
      type: DataTypes.UUID,
      allowNull: false
    },

    sender: {
      type: DataTypes.ENUM(
        "CUSTOMER",
        "BOT",
        "ADMIN"
      ),
      allowNull: false
    },

    message: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },
  {
    tableName: "chat_messages"
  }
);

module.exports = ChatMessage;