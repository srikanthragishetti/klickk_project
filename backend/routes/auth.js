// backend/routes/auth.js
import express from "express";
import bcrypt from "bcrypt";
import db from "../db.js";

const router = express.Router(); // Router for /api/auth used for auth routes

// Register
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email?.trim() || !password?.trim()) {             // !email?.trim() || !password?.trim() checks for null/undefined and empty strings after trimming whitespace
      return res.status(400).json({ error: "Email and password required" });
    }

    const hashed = await bcrypt.hash(password, 10);  // Hash password with bcrypt (salt rounds = 10)
    db.run(
      "INSERT INTO users (email, password) VALUES (?, ?)",      //The ? ensures email is treated as data, not code. 
      [email.trim().toLowerCase(), hashed],
      function (err) {
        if (err) {
          const msg = err.message.includes("UNIQUE") ? "User already exists" : err.message;
          return res.status(400).json({ error: msg });
        }
        res.status(201).json({ message: "Registered", id: this.lastID });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


// Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email & password required" });

  db.get("SELECT * FROM users WHERE email = ?", [email.trim().toLowerCase()], async (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "DB error" });
    }
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Invalid credentials" });

    // Save user info in the session (avoid storing password)
    req.session.user = { id: user.id, email: user.email };
    res.json({ message: "Login successful", user: req.session.user });
  });
});

// Session check
router.get("/me", (req, res) => {
  if (req.session?.user) {
    return res.json({ loggedIn: true, user: req.session.user });
  }
  return res.json({ loggedIn: false });
});

// Logout
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out" });
  });
});

// Protected endpoint example
function ensureAuth(req, res, next) {
  if (req.session?.user) return next();
  return res.status(401).json({ error: "Unauthorized" });
}
router.get("/protected", ensureAuth, (req, res) => {
  res.json({ message: `Protected data for ${req.session.user.email}` });
});

export default router;
