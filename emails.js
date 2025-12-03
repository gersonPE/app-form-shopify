import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendAdminAndClientEmails({ adminEmail, clientEmail, submission }) {
  
  const html = `
    <h2>Nueva respuesta del formulario</h2>
    <p><b>ID:</b> ${submission.submission_id}</p>
    <p><b>Nombre:</b> ${submission.nombre_completo}</p>
    <p><b>Documento:</b> ${submission.documento_identidad}</p>
    <p><b>Fecha compra:</b> ${submission.fecha_compra}</p>
    <p><b>Requerimiento:</b> ${submission.tipo_requerimiento}</p>
    <p><b>Detalles:</b> ${submission.detalles_requerimiento}</p>
  `;

  // Admin email
  await resend.emails.send({
    from: "no-reply@tu-dominio.com",
    to: adminEmail,
    subject: `Nueva solicitud #${submission.submission_id}`,
    html
  });

  // Client email
  await resend.emails.send({
    from: "no-reply@tu-dominio.com",
    to: clientEmail,
    subject: `Hemos recibido tu solicitud #${submission.submission_id}`,
    html: `<p>Hola ${submission.nombre_completo}, hemos recibido tu solicitud. Tu ID es <b>${submission.submission_id}</b>.</p>`
  });
}
