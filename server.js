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
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static frontend (form snippet & admin)
app.use(express.static(path.join(__dirname, "public")));

// API routes
app.use("/api", adminApiRoute);
app.use("/", submitFormRoute);

// Health
app.get("/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
