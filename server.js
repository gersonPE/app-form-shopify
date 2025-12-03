import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { submitFormRoute } from "./routes/submitForm.js";
import { adminApiRoute } from "./routes/adminApi.js";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ---------------------
//   CORS FIX DEFINITIVO
// ---------------------
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://lupebeauty.com");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "false");

  if (req.method === "OPTIONS") {
    return res.status(200).send("OK");
  }

  next();
});

// remove helmet (causes cors issues in preflight)
// app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static (optional)
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api", adminApiRoute);
app.use("/", submitFormRoute);

// Health check
app.get("/health", (req, res) => res.json({ ok: true }));

// Landing
app.get("/", (req, res) => {
  res.send("Server running OK 🚀");
});

// Port
const PORT = process.env.PORT;
if (!PORT) {
  console.error("❌ process.env.PORT missing");
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
