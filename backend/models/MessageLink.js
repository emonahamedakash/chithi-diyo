const { DataTypes } = require("sequelize");
const db = require("../config/db");
const crypto = require("crypto");

const MessageLink = db.define(
  "MessageLink",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    uniqueLink: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      defaultValue: () => crypto.randomBytes(16).toString("hex"),
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    viewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["uniqueLink"],
      },
    ],
  }
);

// Associations will be setup in the index.js file

module.exports = MessageLink;
