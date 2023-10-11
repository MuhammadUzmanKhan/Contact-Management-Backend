const sequelize = require("../database");
const { DataTypes } = require("sequelize");
const Contact = require("./contact.model");

const User = sequelize.define(
  "user",
  {
    username: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.STRING,
    },
  },
  {
    attributes: {
      exclude: ["password"],
    },
  }
);

User.hasMany(Contact, {
  foreignKey: "userId",
});
Contact.belongsTo(User);

module.exports = User;
