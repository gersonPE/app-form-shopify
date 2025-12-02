import { pool } from "./db.js";
const create = `CREATE TABLE IF NOT EXISTS form_responses (
  id SERIAL PRIMARY KEY,
  submission_id TEXT UNIQUE NOT NULL,
  shop TEXT,
  nombre_completo TEXT,
  telefono TEXT,
  documento_identidad TEXT,
  fecha_compra DATE,
  numero_factura TEXT,
  tipo_requerimiento TEXT,
  detalles_requerimiento TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);`;

async function run(){
  try {
    await pool.query(create);
    console.log("Migration complete: table form_responses created (if not existed).");
    await pool.end();
  } catch (err) {
    console.error("Migration error:", err);
    process.exit(1);
  }
}

run();
