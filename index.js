import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcryptjs";
import session from "express-session";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const db = new pg.Client({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_DATABASE || "world",
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
});
db.connect();

// Initialize DB schema changes
async function initDB() {
  try {
    await db.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(255);`);
    console.log("Database initialized with password column.");
  } catch (err) {
    console.error("Error initializing DB:", err);
  }
}
initDB();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(session({
  secret: process.env.SESSION_SECRET || 'travel-tracker-secret',
  resave: false,
  saveUninitialized: false
}));

// Route to render the main React SPA
app.get("/", (req, res) => {
  res.render("index.ejs");
});

// API: Check if user is logged in
app.get("/api/auth/me", async (req, res) => {
  if (req.session.userId) {
    try {
      const result = await db.query("SELECT id, name, color FROM users WHERE id = $1", [req.session.userId]);
      if (result.rows.length > 0) {
        return res.json({ user: result.rows[0] });
      }
    } catch (err) {
      console.log(err);
    }
  }
  res.status(401).json({ error: "Not authenticated" });
});

// API: Register
app.post("/api/auth/register", async (req, res) => {
  const { name, color, password } = req.body;
  try {
    const checkResult = await db.query("SELECT * FROM users WHERE name = $1", [name]);
    if (checkResult.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }
    const hash = await bcrypt.hash(password, 10);
    const result = await db.query(
      "INSERT INTO users (name, color, password) VALUES ($1, $2, $3) RETURNING id, name, color;",
      [name, color, hash]
    );
    const user = result.rows[0];
    req.session.userId = user.id;
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// API: Login
app.post("/api/auth/login", async (req, res) => {
  const { name, password } = req.body;
  try {
    const result = await db.query("SELECT * FROM users WHERE name = $1", [name]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "User not found" });
    }
    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      req.session.userId = user.id;
      res.json({ user: { id: user.id, name: user.name, color: user.color } });
    } else {
      res.status(401).json({ error: "Incorrect password" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// API: Logout
app.post("/api/auth/logout", (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// API: Get Visited Countries
app.get("/api/countries", async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: "Not authenticated" });
  try {
    const result = await db.query(
      "SELECT country_code FROM visited_countries WHERE user_id = $1;",
      [req.session.userId]
    );
    const countries = result.rows.map((row) => row.country_code);
    res.json({ countries });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// API: Add Country
app.post("/api/countries", async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: "Not authenticated" });
  const input = req.body.country;
  
  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [input.toLowerCase()]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Country not found" });
    }

    const countryCode = result.rows[0].country_code;
    
    // Check if already visited
    const checkVisited = await db.query(
      "SELECT * FROM visited_countries WHERE country_code = $1 AND user_id = $2",
      [countryCode, req.session.userId]
    );

    if (checkVisited.rows.length > 0) {
      return res.status(400).json({ error: "Country already added" });
    }

    await db.query(
      "INSERT INTO visited_countries (country_code, user_id) VALUES ($1, $2)",
      [countryCode, req.session.userId]
    );
    
    res.json({ success: true, countryCode });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
