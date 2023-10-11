const jwt = require("jsonwebtoken");
const { User } = require("../models");
const secretKey = "your-secret-key";
const bcrypt = require("bcrypt");

// Signup user
exports.signup = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username is already taken
    const userExists = await User.findOne({ where: { username } });
    if (userExists) {
      return res.status(409).json({ message: "Username already taken" });
    }
    // Hash the user's password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with hashed password
    const user = await User.create({
      username,
      password: hashedPassword,
      role: "User",
    });

    // Remove the hashed password from the user object before sending in the response
    const userResponse = user.toJSON();
    delete userResponse.password;

    // Generate JWT token
    const token = jwt.sign(
      { username: userResponse.username, role: userResponse.role, id: user.id },
      secretKey
    );

    return res.status(201).json({ user: userResponse, token });
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// User login
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({
      where: { username },
      attributes: { include: ["password"] },
      raw: true,
    });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // Compare provided password with hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      // Remove the password from the user object before sending in the response
      delete user.password;

      // Generate JWT token
      const token = jwt.sign(
        { username: user.username, role: user.role, id: user.id },
        secretKey
      );

      return res.status(200).json({ token, user });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
