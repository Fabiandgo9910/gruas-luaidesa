# 🛡️ Grúas Luaidesa — Sitio Web

Next.js 14 + Tailwind CSS + Supabase (base de datos de clientes) + Google Analytics 4

Esta guía asume que **no tienes experiencia técnica previa**. Sigue los pasos en orden y en unos 30-40 minutos tendrás el sitio funcionando y publicado.

---

## 🧰 Paso 0 — Lo que necesitas antes de empezar

- Un ordenador (Windows, Mac o Linux)
- Una cuenta de correo (ya tienes `gruasluaidesa@gmail.com`)
- 30-40 minutos

Vamos a instalar 2 programas gratuitos:

### 0.1 Instalar Node.js
1. Ve a [nodejs.org](https://nodejs.org)
2. Descarga la versión **LTS** (la que pone "Recommended for most users")
3. Instálalo haciendo doble clic y aceptando todo por defecto
4. Para comprobar que se instaló bien, abre una terminal (en Mac: Spotlight → "Terminal"; en Windows: busca "PowerShell") y escribe:
   ```bash
   node -v
   ```
   Debería mostrarte algo como `v20.x.x`

### 0.2 Instalar un editor de código (opcional pero recomendado)
Descarga [Visual Studio Code](https://code.visualstudio.com) (gratis). Te servirá para abrir la carpeta del proyecto y editar textos si algún día quieres cambiar algo.

---

## 📦 Paso 1 — Descomprimir y preparar el proyecto

1. Descomprime el archivo `gruas-luaidesa-optimizado.zip` en tu escritorio (o donde prefieras)
2. Abre la terminal y navega hasta esa carpeta. Por ejemplo, si está en el escritorio:
   ```bash
   cd Desktop/gruas-luaidesa
   ```
3. Instala las dependencias del proyecto (descarga todo lo que el código necesita para funcionar):
   ```bash
   npm install
   ```
   Esto tardará 1-2 minutos. Verás muchas líneas de texto pasar — es normal.

---

## 🗄️ Paso 2 — Crear tu base de datos en Supabase (donde se guardan los clientes)

Esto sustituye a Google Sheets: es una base de datos real, profesional, privada y que crece sola con cada solicitud que llega por la web.

1. Ve a [supabase.com](https://supabase.com) y haz clic en **"Start your project"**
2. Regístrate con tu email o con Google (te recomiendo usar `gruasluaidesa@gmail.com`)
3. Haz clic en **"New Project"**
   - **Name**: `gruas-luaidesa`
   - **Database Password**: genera una contraseña segura y **guárdala en un lugar seguro** (gestor de contraseñas, nota privada)
   - **Region**: elige `West EU (Ireland)` o similar (la más cercana a España)
   - Haz clic en **"Create new project"** y espera 1-2 minutos mientras se crea

5. Una vez creado, en el menú lateral izquierdo haz clic en el icono de **"SQL Editor"** (parece una terminal `>`)
6. Haz clic en **"New query"**
7. Abre el archivo `supabase/schema.sql` que viene dentro de la carpeta del proyecto (ábrelo con el Bloc de notas, TextEdit o VS Code), copia **todo** su contenido, y pégalo en el recuadro del SQL Editor de Supabase
8. Haz clic en el botón **"Run"** (o pulsa `Ctrl+Enter` / `Cmd+Enter`)
9. Deberías ver un mensaje de éxito ("Success. No rows returned"). Esto ha creado **tres tablas**:
   - `leads` → clientes que rellenan el formulario de la grúa
   - `baterias` → el catálogo de la tienda de baterías
   - `eventos_contacto` → cada clic en llamar/WhatsApp y cada formulario enviado, para llevar control real de contactos

### Obtener tus claves de Supabase

1. En el menú lateral, ve a **"Project Settings"** (icono de engranaje) → **"API"**
2. Copia estos valores, los necesitarás en el Paso 4:
   - **Project URL** (algo como `https://xxxxx.supabase.co`)
   - **anon public** (en la sección "Project API keys" — esta es pública por diseño, solo sirve para el login del panel de administración)
   - **service_role** (en la misma sección — haz clic en "Reveal" para verla completa)

   ⚠️ **Importante**: la clave `service_role` da acceso completo a tus datos. No la compartas ni la publiques nunca en redes sociales, foros o repositorios públicos. En este proyecto solo se usa de forma segura, en el servidor. La `anon public` sí está pensada para ser pública, no hay problema en usarla en el navegador.

### Cómo ver los clientes que van llegando

Cada vez que alguien rellene el formulario de la web, aparecerá aquí:
- Entra en tu proyecto de Supabase → menú lateral → **"Table Editor"** → tabla **"leads"**
- Verás nombre, teléfono, email, ciudad, tipo de servicio, mensaje y fecha de cada solicitud
- Hay una columna **"estado"** que puedes editar manualmente para marcar cada cliente como `nuevo`, `contactado`, `en_curso`, `cerrado` o `descartado` — te sirve como mini-CRM para hacer seguimiento

---

## 👤 Paso 2bis — Crear tu usuario Super Admin (para entrar al panel de baterías)

El panel de administración de baterías (`/panel-control`) usa el sistema de autenticación de Supabase. Vamos a crear tu usuario administrador directamente desde el dashboard — es más seguro que hacerlo por código:

1. En tu proyecto de Supabase, ve al menú lateral → **"Authentication"** → pestaña **"Users"**
2. Haz clic en **"Add user"** → **"Create new user"**
3. Rellena:
   - **Email**: el correo con el que vas a entrar al panel (puede ser `gruasluaidesa@gmail.com` o uno específico para gestión)
   - **Password**: una contraseña segura (apúntala en tu gestor de contraseñas)
   - Marca la casilla **"Auto Confirm User"** (así no hace falta que confirmes el email para poder entrar)
4. Haz clic en **"Create user"**

Con esto ya tienes tu Super Admin. Podrás iniciar sesión en `/panel-control/login` con ese email y contraseña.

**¿Quieres añadir más de un administrador?** Repite estos mismos pasos con otro email — cualquier usuario que exista en Authentication → Users podrá entrar al panel. No hay roles distintos: todo usuario que crees aquí tiene acceso completo al panel.



---

## ⚙️ Paso 3 — Configurar Google Analytics (opcional, pero recomendado)

Esto te permite ver cuánta gente visita tu web, desde dónde, y cuántos hacen clic en "Llamar" o "WhatsApp".

1. Ve a [analytics.google.com](https://analytics.google.com) y entra con tu cuenta de Google
2. Crea una cuenta nueva → nombre "Grúas Luaidesa"
3. Crea una propiedad → elige "Web", pon la URL de tu futuro dominio (por ejemplo `gruasluaidesa.com`)
4. Ve a **Admin** (icono de engranaje abajo a la izquierda) → **"Flujos de datos"** → tu flujo web
5. Copia el **"ID de medición"**, tiene el formato `G-XXXXXXXXXX`

Si no quieres configurar esto ahora, puedes dejarlo vacío y el sitio funcionará igual — simplemente no se registrarán estadísticas de visitas hasta que lo añadas.

---

## 🔑 Paso 4 — Rellenar tus datos reales (el archivo de configuración)

1. Dentro de la carpeta del proyecto, busca el archivo llamado `.env.local.example`
2. Haz una copia de ese archivo y renómbrala a `.env.local` (quitando ".example")
   - En Mac/Linux, puedes hacerlo desde la terminal:
     ```bash
     cp .env.local.example .env.local
     ```
   - En Windows, copia el archivo y renómbralo desde el explorador de archivos
3. Abre `.env.local` con el Bloc de notas o VS Code y rellena así:

   ```
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=pega_aqui_tu_service_role_key

   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=pega_aqui_tu_anon_public_key

   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

   NEXT_PUBLIC_WHATSAPP_NUMBER=34674088195
   NEXT_PUBLIC_PHONE_NUMBER=+34 674 08 81 95
   NEXT_PUBLIC_EMAIL=gruasluaidesa@gmail.com

   NEXT_PUBLIC_SITE_URL=https://www.gruasluaidesa.com
   ```

   - Sustituye `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` por los valores que copiaste en el Paso 2
   - Sustituye `NEXT_PUBLIC_SUPABASE_URL` (la misma URL de arriba) y `NEXT_PUBLIC_SUPABASE_ANON_KEY` por la clave `anon public` que copiaste también en el Paso 2 — son necesarias para poder iniciar sesión en `/panel-control`
   - Sustituye `NEXT_PUBLIC_GA_MEASUREMENT_ID` por el ID del Paso 3 (o déjalo vacío si no lo has configurado)
   - `NEXT_PUBLIC_SITE_URL` ponlo con el dominio real que vayas a usar (aunque aún no lo tengas comprado, puedes poner el que planeas usar)

4. Guarda el archivo

---

## 💻 Paso 5 — Probar el sitio en tu ordenador (antes de publicarlo)

En la terminal, dentro de la carpeta del proyecto:

```bash
npm run dev
```

Espera a que aparezca algo como `Ready in 2s`, y luego abre tu navegador en:

```
http://localhost:3000
```

Ya deberías ver la web funcionando. Pruébala:
- Haz clic en los botones de "Llamar" y "WhatsApp" — deberían intentar abrir tu teléfono/WhatsApp con tu número real
- Rellena el formulario de contacto con datos de prueba y envíalo
- Ve a Supabase → Table Editor → leads y comprueba que ha aparecido tu envío de prueba

Para detener el sitio de prueba, vuelve a la terminal y pulsa `Ctrl + C`.

---

## 🚀 Paso 6 — Publicar el sitio en internet (Vercel, gratis)

Vercel es la plataforma que crea la misma empresa que hace Next.js — es la opción más sencilla y gratuita para este tipo de web.

1. Ve a [vercel.com](https://vercel.com) y regístrate (puedes usar tu cuenta de GitHub o email)
2. Haz clic en **"Add New..."** → **"Project"**
3. Tienes dos opciones:
   - **Opción fácil (recomendada)**: sube la carpeta del proyecto arrastrándola en la web de Vercel cuando te lo pida ("Deploy without Git" / subida directa)
   - **Opción con GitHub** (si en el futuro quieres que un programador siga editando el código): sube el proyecto a un repositorio de GitHub y conéctalo desde Vercel

4. Antes de darle a "Deploy", Vercel te pedirá las **variables de entorno**. Añade una por una (el nombre a la izquierda, el valor a la derecha), copiando los mismos valores que pusiste en tu archivo `.env.local`:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`
   - `NEXT_PUBLIC_PHONE_NUMBER`
   - `NEXT_PUBLIC_EMAIL`
   - `NEXT_PUBLIC_SITE_URL`

5. Haz clic en **"Deploy"** y espera 1-2 minutos
6. ¡Listo! Vercel te dará una URL tipo `gruas-luaidesa.vercel.app` donde ya está tu web publicada y funcionando

### Conectar tu dominio propio (por ejemplo, gruasluaidesa.com)

1. Compra el dominio en cualquier proveedor (Namecheap, GoDaddy, IONOS, Dondominio...) si aún no lo tienes
2. En Vercel, entra en tu proyecto → **"Settings"** → **"Domains"**
3. Escribe tu dominio y sigue las instrucciones (Vercel te dará unos registros DNS que debes copiar en el panel de tu proveedor de dominio)
4. En 15 minutos a 24 horas tu dominio apuntará ya a la web

---

## 🔋 Tienda de Baterías — Guía completa del panel de administración

Esta parte es nueva: además de la grúa, la web ahora vende e instala baterías de coche a domicilio. Tiene su propia tienda pública y un panel de administración privado para gestionar el catálogo.

### Cómo entrar al panel

El panel **no tiene ningún enlace visible en la web** (a propósito, para que no lo vea un cliente normal). Se accede escribiendo la URL directamente en el navegador:

```
https://tudominio.com/panel-control/login
```

(o `http://localhost:3000/panel-control/login` mientras pruebas en tu ordenador)

Entra con el email y contraseña que creaste en el **Paso 2bis**. Guarda esta URL en tus marcadores/favoritos — es tu acceso privado.

### ¿Se me olvidó la contraseña?

1. En la pantalla de login, haz clic en **"¿Has olvidado tu contraseña?"**
2. Escribe tu email y pulsa "Enviar enlace"
3. Revisa tu correo (y la carpeta de spam) — te llegará un enlace de Supabase para restablecerla
4. Al hacer clic, se abrirá una pantalla en tu propia web para escribir la nueva contraseña

> Si el correo no llega: por defecto, Supabase envía estos emails desde su propio servidor con límites bajos (útil para probar, pero poco fiable para producción). Si esto te da problemas más adelante, en Supabase → **Authentication → Providers → Email** puedes conectar tu propio proveedor de email (por ejemplo Resend o SMTP de tu dominio) para que los envíos sean fiables.

### El panel tiene 3 secciones

- **Resumen** (`/panel-control`) — Cifras de llamadas, WhatsApp (grúa y baterías), formularios enviados, y cuántas baterías tienes publicadas.
- **Baterías** (`/panel-control/baterias`) — El catálogo completo: crear, editar, publicar/ocultar, eliminar (una a una o en lote), e importar desde Excel.
- **Contactos** (`/panel-control/contactos`) — El listado en tiempo real de cada llamada, WhatsApp y formulario recibido (ver más abajo).

### Crear una batería manualmente

1. Ve a **Baterías** → **"+ Nueva batería"**
2. Solo son obligatorios el **Modelo** y la **URL de la imagen**. Marca, amperaje, precio y si tiene Start-Stop son opcionales
3. Sobre la imagen: como es un enlace (URL), primero tienes que subir la foto a algún sitio que te dé un link directo — por ejemplo, súbela a un servicio de imágenes gratuito, a tu Google Drive/Dropbox en modo público, o pide a tu proveedor de baterías el link de sus fotos de catálogo. Pega ese enlace en el campo
4. Marca si quieres que se publique ya o la dejas oculta para revisarla después
5. Pulsa "Crear batería" — aparecerá al momento en `/baterias-coche-madrid` si está publicada

### Editar, publicar/ocultar o eliminar

- En la tabla de **Baterías**, pulsa **"Editar"** para cambiar cualquier dato
- Pulsa la pastilla de **"Publicada" / "Oculta"** para alternar si se ve en la tienda sin necesidad de borrarla (útil si se te agota temporalmente)
- Pulsa **"Eliminar"** para borrarla del todo (pide confirmación)

### Eliminar varias a la vez

1. Marca las casillas de las baterías que quieras borrar (o la casilla de la cabecera para marcarlas todas)
2. Aparecerá una barra arriba con el botón **"Eliminar seleccionadas"**
3. Confirma — se eliminan todas de golpe

### Importar baterías en lote desde un Excel

Esto te ahorra crearlas una por una si tienes muchas.

1. Ve a **Baterías** → **"Importar Excel"**
2. Prepara un archivo `.xlsx` con una fila por batería y estas columnas en la primera fila (el orden no importa):

   | modelo * | imagen * | marca | precio | amperaje | start_stop |
   |---|---|---|---|---|---|
   | Tudor TA640 | https://.../ta640.jpg | Tudor | 89.90 | 64 | si |
   | Varta E11 |  https://.../e11.jpg  | Varta |  |  |  |

   - **Obligatorias**: `modelo` e `imagen` (con la URL directa a la foto). Si falta cualquiera de las dos en una fila, esa fila se rechaza (pero el resto se crean igualmente)
   - **Opcionales**: `marca`, `precio`, `amperaje` — pueden quedar vacías sin problema
   - `start_stop` acepta `si` / `no`, `true` / `false`, o `1` / `0`
   - También se aceptan estos nombres alternativos de columna: `imagen_url`, `url_imagen`, `foto` (para la imagen) y `arranque_parada`, `stop_start` (para el Start-Stop)

3. Sube el archivo y pulsa "Importar"
4. Verás cuántas se crearon correctamente y, si alguna fila falló, el motivo exacto (por ejemplo "Falta la imagen (obligatorio)")
5. Todas las importadas se crean **publicadas** por defecto — puedes ocultarlas después si hace falta revisarlas antes

### El botón de WhatsApp de cada batería

Cada batería de la tienda tiene un botón **"Consultar por WhatsApp"** que abre WhatsApp con un mensaje ya escrito, incluyendo el modelo exacto que le interesa al cliente (por ejemplo: *"Hola, me interesa la batería Tudor TA640. ¿Precio y disponibilidad?"*). Así nunca tienes que preguntar qué batería quería.

### El botón "¿No sabes qué batería lleva tu coche?"

Está en la tienda pública, encima del listado. Al pulsarlo, se abre un formulario corto (marca, modelo y año del coche del cliente) y, al enviarlo, se abre WhatsApp con ese mensaje ya redactado para ti. Es la opción para clientes que no saben el modelo exacto de su batería.

### Filtros de la tienda pública

En `/baterias-coche-madrid`, el cliente puede filtrar por:
- Texto libre (busca en marca + modelo)
- Marca (desplegable, se genera solo con las marcas que tengas dadas de alta)
- Rango de amperaje
- Solo baterías con sistema Start-Stop

### Control de llamadas y contactos por WhatsApp

Cada vez que alguien pulsa un botón de llamar, un botón de WhatsApp (tanto de grúas como de baterías), o envía el formulario de contacto, queda registrado automáticamente en **Contactos** (`/panel-control/contactos`) con fecha, tipo, desde qué botón/página y, en el caso de baterías, qué modelo preguntó. Esto funciona **independientemente de Google Analytics** — así que tienes cifras exactas aunque el visitante bloquee cookies o rechace el banner de analítica.



---

## ✅ Checklist final — no olvides esto antes de dar la web por lanzada

- [ ] Ejecutado `supabase/schema.sql` en Supabase y comprobado que existen las tablas `leads`, `baterias` y `eventos_contacto`
- [ ] Creado tu usuario Super Admin en Supabase → Authentication → Users (Paso 2bis)
- [ ] Rellenado `.env.local` con tus datos reales, incluidas `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Probado el formulario de grúa en local (`npm run dev`) y confirmado que el envío aparece en Supabase
- [ ] Probado el login en `/panel-control/login` y creado al menos una batería de prueba
- [ ] Configurado las mismas variables de entorno en Vercel (incluidas las de Supabase Auth)
- [ ] Publicado el sitio y probado los botones de llamada/WhatsApp desde el móvil real, tanto en la grúa como en la tienda de baterías
- [ ] Comprobado que `/panel-control` no aparece en ningún menú visible ni en el sitemap público
- [ ] Conectado tu dominio propio (opcional pero recomendado para dar imagen profesional)
- [ ] Verificado el sitio en [Google Search Console](https://search.google.com/search-console) para que aparezca en Google
- [ ] Revisado las páginas legales (`Política de Privacidad`, `Condiciones de Uso`, `Protección de Datos`) con tu gestoría o asesor legal para confirmar razón social, CIF y domicilio fiscal exactos
- [ ] Activado Google Analytics y comprobado que se ven visitas en tiempo real (tras aceptar el banner de cookies en tu propia visita)

---

## 📊 Qué se mide automáticamente (una vez tengas Analytics activado)

| Acción del visitante | Evento de Google Analytics | ¿También en "Contactos" del panel? |
|---|---|---|
| Pulsa "Llamar" (grúa) | `click_phone` | Sí (`llamada`) |
| Pulsa "WhatsApp" (grúa) | `click_whatsapp` | Sí (`whatsapp`) |
| Pulsa "Consultar por WhatsApp" (batería) | `click_whatsapp_bateria` | Sí (`whatsapp_bateria`, con el modelo) |
| Usa "¿Qué batería lleva mi coche?" | `click_whatsapp_bateria` | Sí (`whatsapp_bateria`, con marca/modelo del coche) |
| Envía el formulario de grúa | `lead_form_submit` | — |
| El formulario se guarda con éxito | `lead_form_success` | Sí (`formulario`) |
| Hay un error al enviar | `lead_form_error` | — |

La columna de "Contactos" es tu propia base de datos (tabla `eventos_contacto`), separada de Google Analytics — te da cifras reales de conversión aunque el visitante no acepte cookies. Consúltala en `/panel-control/contactos`, o directamente en Supabase → Table Editor → `eventos_contacto` / vista `eventos_resumen` (resumen agrupado por día).

---

## 🛡️ Protección contra spam del formulario

El formulario tiene 3 capas de seguridad para que no se llene de mensajes basura:
1. **Campo trampa invisible**: si un robot lo rellena (los humanos no lo ven), su envío se descarta automáticamente
2. **Límite de envíos**: máximo 5 solicitudes por minuto desde la misma conexión
3. **Validación en el servidor**: se comprueba que el teléfono y el email tengan un formato válido antes de guardarlo

---

## 📁 Estructura del proyecto (por si en el futuro un programador continúa el trabajo)

```
gruas-luaidesa/
├── app/
│   ├── layout.tsx                      # Metadatos SEO globales + JSON-LD (grúa + baterías)
│   ├── page.tsx                        # Página principal (Hero, Servicios, Baterías, Cobertura, Proceso, FAQ, Formulario)
│   ├── globals.css                     # Estilos y paleta de colores
│   ├── sitemap.ts / robots.ts          # SEO técnico (incluye fichas de baterías e ignora /panel-control)
│   ├── middleware.ts                   # Protege /panel-control (exige sesión de Supabase Auth)
│   ├── api/leads/route.ts              # Recibe el formulario de grúa y lo guarda en Supabase
│   ├── api/eventos/route.ts            # Registra cada llamada/WhatsApp/formulario (control de contactos)
│   ├── api/admin/baterias/             # CRUD, borrado en lote e importación por Excel (requiere sesión)
│   ├── baterias-coche-madrid/          # Tienda pública (listado con filtros + ficha por batería)
│   ├── panel-control/                  # Panel de administración privado (login, dashboard, CRUD, contactos)
│   └── politica-privacidad/, condiciones-uso/, proteccion-datos/  # Páginas legales
├── components/
│   ├── icons.tsx                        # Iconos propios (sin emojis)
│   ├── Navbar.tsx / Footer.tsx / LeadForm.tsx / CookieBanner.tsx / FloatingWhatsApp.tsx / GoogleAnalytics.tsx / Reveal.tsx
│   ├── BateriaCard.tsx / BateriasStore.tsx / CocheBateriaModal.tsx / BateriaWhatsAppButton.tsx  # Tienda pública
│   └── admin/BateriasTabla.tsx / BateriaForm.tsx / LogoutButton.tsx                              # Panel admin
├── lib/
│   ├── analytics.ts                     # Eventos de Google Analytics + registro en "Contactos"
│   ├── supabase.ts                      # Conexión a la base de datos (leads, baterías, eventos) — solo servidor
│   ├── supabase-browser.ts              # Cliente de Auth para el navegador (login/recuperar password)
│   ├── supabase-server.ts               # Cliente de Auth para Server Components / API routes
│   └── admin-auth.ts                    # Comprueba la sesión en las API routes de /api/admin
├── supabase/
│   └── schema.sql                       # Estructura de la base de datos (leads, baterias, eventos_contacto)
└── .env.local.example                   # Plantilla de configuración
```

---

## 🎨 Paleta de colores (se mantiene la identidad original)

| Color | Código | Uso |
|---|---|---|
| Dorado | `#C9A227` | Color principal de marca |
| Dorado claro | `#F0C93A` | Textos destacados |
| Negro marca | `#1A1208` | Fondo principal |
| Marrón oscuro | `#2C1F0A` | Fondo secundario |
| Crema | `#FAF6EC` | Texto sobre fondo oscuro |

---

## ❓ ¿Algo no funciona?

- **El formulario no guarda nada en Supabase** → revisa que `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` en `.env.local` (o en Vercel) sean exactamente los que copiaste de tu proyecto, sin espacios extra
- **No veo visitas en Google Analytics** → recuerda que las estadísticas solo se activan cuando el propio visitante acepta el banner de cookies; prueba a aceptar el banner tú mismo en una visita real
- **Los botones de llamada no hacen nada al probarlos en el ordenador** → es normal, el `tel:` y `wa.me` solo abren aplicaciones reales en un móvil; en el ordenador puede que no pase nada visible o te pregunte con qué programa abrirlo
- **No puedo entrar a `/panel-control`, me redirige siempre al login** → revisa que `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` estén bien puestas en `.env.local` (o en Vercel) y que hayas creado tu usuario en Supabase → Authentication → Users con "Auto Confirm User" marcado
- **El email de recuperar contraseña no llega** → revisa spam; si sigue sin llegar, es el límite de envíos del email de prueba de Supabase — conecta un proveedor de email propio en Authentication → Providers → Email para producción
- **Al importar el Excel me dice que faltan columnas / todas las filas fallan** → confirma que la primera fila del Excel es la cabecera con los nombres de columna (`modelo`, `imagen`, `marca`, `precio`, `amperaje`, `start_stop`) y que no hay filas vacías por encima
- **Las imágenes de las baterías no se ven** → el campo "imagen" debe ser una URL pública y directa a la foto (que termine en `.jpg`, `.png`, etc. y se pueda abrir sola en el navegador), no un enlace a una carpeta de Drive ni una foto adjunta
