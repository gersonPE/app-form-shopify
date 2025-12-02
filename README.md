# Shopify Form App (Node.js)

Proyecto: app Node.js que recibe un formulario fijo desde Shopify, guarda en PostgreSQL, envía correos (admin + cliente)
y expone un panel admin simple para ver envíos.

## Requisitos
- Node.js 18+
- PostgreSQL
- Un hosting público (Railway, Render, Fly, etc.)
- Configurar variables de entorno en `.env` o en tu hosting.

## Archivos importantes
- `server.js` - servidor Express principal
- `db.js` - conexión a PostgreSQL
- `migrate.js` - script para crear la tabla
- `emails.js` - envío de correos con nodemailer
- `public/` - frontend estático (form/snippet y admin panel)
- `.env.example` - variables de entorno

## Campos del formulario
- nombre_completo
- telefono
- documento_identidad
- fecha_compra
- numero_factura
- tipo_requerimiento
- detalles_requerimiento

## Cómo usar
1. Copia `.env.example` a `.env` y completa las variables.
2. Instala dependencias:
   ```
   npm install
   ```
3. Ejecuta migración para crear la tabla:
   ```
   npm run migrate
   ```
4. Inicia:
   ```
   npm run dev
   ```
5. Publica en un hosting con HTTPS y configura el snippet/form en tu tienda Shopify para apuntar a `https://TU_HOST/submit-form`.

## Notas sobre Shopify
Para instalar como app pública con OAuth necesitarías implementar el flujo OAuth. Este proyecto está pensado para uso como app privada/custom app donde la tienda hace POST al endpoint `/submit-form`.
