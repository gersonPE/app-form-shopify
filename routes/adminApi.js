import express from "express";
import basicAuth from "basic-auth";
import { pool } from "../db.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

function requireAuth(req, res, next){
  const user = basicAuth(req);
  const adminUser = process.env.ADMIN_USER || "admin";
  const adminPass = process.env.ADMIN_PASS || "changeme";
  if(!user || user.name !== adminUser || user.pass !== adminPass){
    res.set('WWW-Authenticate', 'Basic realm="Admin Area"');
    return res.status(401).send("Authentication required.");
  }
  next();
}

// Return list of responses (protected)
router.get("/responses", requireAuth, async (req, res) => {
  try {
    const q = 'SELECT * FROM form_responses ORDER BY created_at DESC LIMIT 1000';
    const r = await pool.query(q);
    res.json(r.rows);
  } catch (err) {
    console.error("admin responses error:", err);
    res.status(500).json({ error: "Internal error" });
  }
});

export const adminApiRoute = router;
