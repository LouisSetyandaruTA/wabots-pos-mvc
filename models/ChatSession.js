const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ChatSession = sequelize.define(
  "ChatSession",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },

    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    businessId: {
      type: DataTypes.UUID,
      allowNull: false
    },

    mode: {
      type: DataTypes.ENUM(
        "AI",
        "HUMAN"
      ),
      defaultValue: "AI"
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },

    lastMessage: {
      type: DataTypes.TEXT
    },

    needAdmin: {
      type: DataTypes.BOOLEAN,
        defaultValue: false
    }
  },
  {
    tableName: "chat_sessions"
  }
);

module.exports = ChatSession;