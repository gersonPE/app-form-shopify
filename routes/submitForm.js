import express from "express";
import { pool } from "../db.js";
import { sendAdminAndClientEmails } from "../emails.js";
import { v4 as uuidv4 } from "uuid";

export const submitFormRoute = express.Router();

/**
 * Endpoint to receive form submissions from the storefront.
 * Expected JSON body:
 * {
 *   shop: "mi-tienda.myshopify.com",
 *   nombre_completo, telefono, documento_identidad,
 *   fecha_compra (YYYY-MM-DD), numero_factura,
 *   tipo_requerimiento, detalles_requerimiento, email
 * }
 */
submitFormRoute.post("/submit-form", async (req, res) => {
  try {
    const {
      shop,
      nombre_completo,
      telefono,
      documento_identidad,
      fecha_compra,
      numero_factura,
      tipo_requerimiento,
      detalles_requerimiento,
      email
    } = req.body;

    if(!email || !nombre_completo) {
      return res.status(400).json({ ok:false, error: "Faltan campos requeridos (email, nombre_completo)"});
    }

    const submission_id = `FORM-${Date.now()}-${uuidv4().slice(0,8).toUpperCase()}`;

    const insertQuery = `INSERT INTO form_responses
      (submission_id, shop, nombre_completo, telefono, documento_identidad, fecha_compra, numero_factura, tipo_requerimiento, detalles_requerimiento)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *;`;

    const values = [submission_id, shop || null, nombre_completo, telefono || null, documento_identidad || null, fecha_compra || null, numero_factura || null, tipo_requerimiento || null, detalles_requerimiento || null];

    const result = await pool.query(insertQuery, values);

    // Send emails (admin + client)
    await sendAdminAndClientEmails({
      adminEmail: process.env.ADMIN_EMAIL,
      clientEmail: email,
      submission: result.rows[0]
    });

    res.json({ ok:true, submission_id });

 } catch (err) {
  console.error("❌ ERROR en /submit-form:");
  console.error("Mensaje:", err.message);
  console.error("Stack:", err.stack);
  console.error("Body recibido:", req.body);

  res.status(500).json({ ok:false, error: err.message || "Internal error" });
}
});
