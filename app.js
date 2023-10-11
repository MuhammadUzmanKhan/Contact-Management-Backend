const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth-routes");
const contactRoutes = require("./routes/contact-routes");
const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());

// initialize DB and Models
require("./models/intializer");

// Routes
app.use("/auth", authRoutes);
app.use("/contacts", contactRoutes);

// app listen
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
