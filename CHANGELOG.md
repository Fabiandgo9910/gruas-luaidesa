# Historial de versiones — Grúas Luaidesa

Registro de los cambios importantes del proyecto, de más reciente a más antiguo.

## 2.1.0 — Seguridad, rendimiento y diseño (cristal)

### Añadido
- Diseño **glassmorphism** (paneles de cristal esmerilado) en el header, tarjetas de batería, modal "qué batería lleva tu coche" y bloque de contacto del footer
- Cabeceras de seguridad HTTP (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
- Limitador de peticiones (rate limiting) por IP en el formulario de contacto y la subida de imágenes
- Segunda capa anti-bot en el formulario: detección de envíos "instantáneos" además del honeypot ya existente
- Validación de longitud máxima en todos los campos de texto del formulario
- Página 404 personalizada con el diseño de la marca
- Botón flotante "volver arriba"
- Barra de progreso dorada en cada cambio de página
- Pantallas de carga (`loading.tsx`) con efecto shimmer en la tienda y el panel de administración
- Animación de entrada escalonada en el hero de la home
- Micro-interacciones (pulsación/hover) en los botones principales
- Nuevo bloque de llamada a la acción antes del footer (refuerza conversión)
- Historial de versiones (este archivo)

### Corregido
- Eliminado el riesgo de scroll horizontal accidental en toda la web
- Auditoría de enlaces internos: confirmado que ninguno apunta a un sitio inexistente

## 2.0.0 — Tienda de baterías

### Añadido
- Tienda pública de baterías de coche con filtros (marca, amperaje, Start-Stop) y ficha SEO por producto
- Panel de administración privado (`/panel-control`) con autenticación (Supabase Auth), recuperación de contraseña
- CRUD completo de baterías: crear, editar, publicar/ocultar, eliminar, borrado en lote
- Importación masiva por Excel
- Subida de fotos directa a Supabase Storage (sin URLs manuales)
- Aviso por email (Resend) de cada solicitud del formulario, además de guardarse en Supabase
- SEO local: datos estructurados (empresa, servicios, producto, FAQ), migas de pan, zonas de cobertura reales
- Eventos de Google Analytics para llamadas, WhatsApp y formularios

## 1.0.0 — Lanzamiento inicial

- Web de Grúas Luaidesa: home, formulario de contacto (Supabase), páginas legales (privacidad, condiciones, RGPD), SEO básico, Google Analytics, botón flotante de WhatsApp
