const { DataTypes } = require("sequelize");
const db = require("../config/db");

const AnonymousMessage = db.define(
  "AnonymousMessage",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 5000],
      },
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    senderIp: {
      type: DataTypes.STRING(45), // IPv6 length
      allowNull: true, // Only store if required by law
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    paranoid: true, // Soft deletion
    defaultScope: {
      attributes: { exclude: ["senderIp", "userAgent"] }, // Hide sensitive by default
    },
    scopes: {
      withSensitive: {
        attributes: { include: ["senderIp", "userAgent"] }, // Only for admin/moderation
      },
    },
  }
);

// Associations will be setup in the index.js file

module.exports = AnonymousMessage;
