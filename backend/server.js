
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import authRoutes from "./routes/auth.js";

import db from "./db.js";

const app = express();
const PORT = 5000;

// Middlewares
app.use(express.json()); // for parsing application/json
app.use(cookieParser()); // You can read and write cookies with cookie-parser middleware (e.g., req.cookies, res.cookie()) it is optional but useful for handling cookies

// CORS: allow Vite dev server origin and credentials
app.use(
  cors({
    origin: "http://localhost:3000", // Vite dev server port (we'll set this below)
    credentials: true,
  })
);

// The actual session data (user info) is stored server-side with a unique session ID . The session ID is sent to the client in a cookie. On subsequent requests, the client sends the cookie with the session ID, allowing the server to retrieve the session data.
app.use(
  session({
    secret: "change_this_secret_in_prod",
    resave: false,                         // don't save session if unmodified if true it will save session on every request even if nothing changed
    saveUninitialized: false,             // don't create session until something stored
    cookie: {
      httpOnly: true,                    // JS on client side cannot access the cookie
      secure: false,                     // set true when using HTTPS (production)
      sameSite: "lax",                   // CSRF protection "lax" is a good balance between security and usability 
      maxAge: 1000 * 60 * 60,            // 1 hour
    },
  })
);

// Routes
app.use("/api/auth", authRoutes); // Auth routes for login, logout, register

// Health
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Start server 

app.listen(PORT, () => console.log(`Backend running at http://localhost:${PORT}`));
