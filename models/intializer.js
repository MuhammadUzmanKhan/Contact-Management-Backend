const User = require("./user.model");
const Contact = require("./contact.model");

(async () => {
  await User.sync();
  await Contact.sync();
})();
