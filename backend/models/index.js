const db = require("../config/db");
const User = require("./User");
const MessageLink = require("./MessageLink");
const AnonymousMessage = require("./AnonymousMessage");

// User has many MessageLinks
User.hasMany(MessageLink, {
  foreignKey: "userId",
  as: "messageLinks",
  onDelete: "CASCADE",
});
MessageLink.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// MessageLink has many AnonymousMessages
MessageLink.hasMany(AnonymousMessage, {
  foreignKey: "linkId",
  as: "messages",
  onDelete: "CASCADE",
});
AnonymousMessage.belongsTo(MessageLink, {
  foreignKey: "linkId",
  as: "messageLink",
});

// Sync all models
db.sync({ alter: true }) // Use { force: true } only in development to drop tables
  .then(() => console.log("Database & tables synced"))
  .catch((err) => console.error("Error syncing database:", err));

module.exports = {
  User,
  MessageLink,
  AnonymousMessage,
};
