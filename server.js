import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
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
app.use(helmet());

// CORS FIX
app.use(cors({
  origin: [
    "https://lupebeauty.com",
    "https://*.lupebeauty.com",
    "https://admin.shopify.com"
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.options("*", cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static (ignorar si no existe carpeta en production)
app.use(express.static(path.join(__dirname, "public")));

// API routes
app.use("/api", adminApiRoute);
app.use("/", submitFormRoute);

// Health check para Railway
app.get("/health", (req, res) => res.json({ ok: true }));

// Landing básico para GET /
app.get("/", (req, res) => {
  res.send("Server running OK 🚀");
});


// EL PUERTO DEBE SER SOLO process.env.PORT
const PORT = process.env.PORT;

if (!PORT) {
  console.error("❌ ERROR: process.env.PORT no está definido (Railway lo envía automáticamente)");
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
