// const User = require("../models/user");

module.exports = {
  users: [
    // new User("superadmin", "adminpass", "superadmin"),
    // new User("user1", "password1", "user"),
    // new User("user2", "password2", "user"),
  ],
  contacts: [
    { id: 1, userId: "user1", name: "John Doe", email: "john@example.com" },
    { id: 2, userId: "user1", name: "Jane Smith", email: "jane@example.com" },
    // Add more contacts
  ],
};
