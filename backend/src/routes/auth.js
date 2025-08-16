const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const { getDbConnection } = require("../database/init");

const router = express.Router();

// Register endpoint
router.post(
  "/register",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
    body("name").trim().isLength({ min: 1 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, name } = req.body;
      const db = getDbConnection();

      // Check if user already exists
      db.get(
        "SELECT id FROM users WHERE email = ?",
        [email],
        async (err, existingUser) => {
          if (err) {
            db.close();
            return res.status(500).json({ message: "Database error" });
          }

          if (existingUser) {
            db.close();
            return res.status(400).json({ message: "User already exists" });
          }

          // Hash password
          const hashedPassword = await bcrypt.hash(password, 10);

          // Create user
          db.run(
            "INSERT INTO users (email, password, name) VALUES (?, ?, ?)",
            [email, hashedPassword, name],
            function (err) {
              if (err) {
                db.close();
                return res.status(500).json({ message: "Error creating user" });
              }

              const userId = this.lastID;

              // Generate JWT token
              const token = jwt.sign(
                { id: userId, email, name },
                process.env.JWT_SECRET,
                { expiresIn: "24h" }
              );

              db.close();
              res.status(201).json({
                message: "User created successfully",
                token,
                user: { id: userId, email, name },
              });
            }
          );
        }
      );
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Login endpoint
router.post(
  "/login",
  [body("email").isEmail().normalizeEmail(), body("password").exists()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      const db = getDbConnection();

      db.get(
        "SELECT id, email, password, name, role FROM users WHERE email = ?",
        [email],
        async (err, user) => {
          db.close();

          if (err) {
            return res.status(500).json({ message: "Database error" });
          }

          if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
          }

          // Check password
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
          }

          // Generate JWT token
          const token = jwt.sign(
            {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
          );

          res.json({
            message: "Login successful",
            token,
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            },
          });
        }
      );
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
