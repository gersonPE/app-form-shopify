import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

function buildAdminHtml(sub){
  return `
    <h2>Nueva respuesta de formulario</h2>
    <p><strong>ID:</strong> ${sub.submission_id}</p>
    <p><strong>Nombre:</strong> ${sub.nombre_completo}</p>
    <p><strong>Teléfono:</strong> ${sub.telefono || "-"}</p>
    <p><strong>Documento:</strong> ${sub.documento_identidad || "-"}</p>
    <p><strong>Fecha compra:</strong> ${sub.fecha_compra || "-"}</p>
    <p><strong>Número factura:</strong> ${sub.numero_factura || "-"}</p>
    <p><strong>Tipo requerimiento:</strong> ${sub.tipo_requerimiento || "-"}</p>
    <p><strong>Detalles:</strong><br/> ${sub.detalles_requerimiento || "-"}</p>
    <p>Creado en: ${sub.created_at}</p>
  `;
}

function buildClientHtml(sub){
  return `
    <h2>Hemos recibido tu solicitud</h2>
    <p>Gracias ${sub.nombre_completo}. Hemos recibido tu requerimiento.</p>
    <p>Tu ID de seguimiento es: <strong>${sub.submission_id}</strong></p>
    <p>Pronto nos pondremos en contacto.</p>
  `;
}

export async function sendAdminAndClientEmails({ adminEmail, clientEmail, submission }){
  // Admin email
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER;

  await transporter.sendMail({
    from,
    to: adminEmail,
    subject: `Nuevo formulario recibido — ${submission.submission_id}`,
    html: buildAdminHtml(submission)
  });

  // Client email
  await transporter.sendMail({
    from,
    to: clientEmail,
    subject: `Recibimos tu solicitud — ${submission.submission_id}`,
    html: buildClientHtml(submission)
  });
}
