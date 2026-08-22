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

4. Una vez creado, en el menú lateral izquierdo haz clic en el icono de **"SQL Editor"** (parece una terminal `>`)
5. Haz clic en **"New query"**
6. Abre el archivo `supabase/schema.sql` que viene dentro de la carpeta del proyecto (ábrelo con el Bloc de notas, TextEdit o VS Code), copia **todo** su contenido, y pégalo en el recuadro del SQL Editor de Supabase
7. Haz clic en el botón **"Run"** (o pulsa `Ctrl+Enter` / `Cmd+Enter`)
8. Deberías ver un mensaje de éxito ("Success. No rows returned"). Esto ha creado la tabla `leads` donde se guardarán todos los clientes que rellenen el formulario

### Obtener tus claves de Supabase

1. En el menú lateral, ve a **"Project Settings"** (icono de engranaje) → **"API"**
2. Copia estos dos valores, los necesitarás en el Paso 4:
   - **Project URL** (algo como `https://xxxxx.supabase.co`)
   - **service_role** (en la sección "Project API keys" — haz clic en "Reveal" para verla completa)

   ⚠️ **Importante**: la clave `service_role` da acceso completo a tus datos. No la compartas ni la publiques nunca en redes sociales, foros o repositorios públicos. En este proyecto solo se usa de forma segura, en el servidor.

### Cómo ver los clientes que van llegando

Cada vez que alguien rellene el formulario de la web, aparecerá aquí:
- Entra en tu proyecto de Supabase → menú lateral → **"Table Editor"** → tabla **"leads"**
- Verás nombre, teléfono, email, ciudad, tipo de servicio, mensaje y fecha de cada solicitud
- Hay una columna **"estado"** que puedes editar manualmente para marcar cada cliente como `nuevo`, `contactado`, `en_curso`, `cerrado` o `descartado` — te sirve como mini-CRM para hacer seguimiento

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

   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

   NEXT_PUBLIC_WHATSAPP_NUMBER=34674088195
   NEXT_PUBLIC_PHONE_NUMBER=+34 674 08 81 95
   NEXT_PUBLIC_EMAIL=gruasluaidesa@gmail.com

   NEXT_PUBLIC_SITE_URL=https://www.gruasluaidesa.com
   ```

   - Sustituye `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` por los valores que copiaste en el Paso 2
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

## ✅ Checklist final — no olvides esto antes de dar la web por lanzada

- [ ] Ejecutado `supabase/schema.sql` en Supabase y comprobado que la tabla `leads` existe
- [ ] Rellenado `.env.local` con tus datos reales
- [ ] Probado el formulario en local (`npm run dev`) y confirmado que el envío aparece en Supabase
- [ ] Configurado las mismas variables de entorno en Vercel
- [ ] Publicado el sitio y probado los botones de llamada/WhatsApp desde el móvil real
- [ ] Conectado tu dominio propio (opcional pero recomendado para dar imagen profesional)
- [ ] Verificado el sitio en [Google Search Console](https://search.google.com/search-console) para que aparezca en Google
- [ ] Revisado las páginas legales (`Política de Privacidad`, `Condiciones de Uso`, `Protección de Datos`) con tu gestoría o asesor legal para confirmar razón social, CIF y domicilio fiscal exactos
- [ ] Activado Google Analytics y comprobado que se ven visitas en tiempo real (tras aceptar el banner de cookies en tu propia visita)

---

## 📊 Qué se mide automáticamente (una vez tengas Analytics activado)

| Acción del visitante | Evento registrado |
|---|---|
| Pulsa "Llamar" (en cualquier botón) | `click_phone` |
| Pulsa "WhatsApp" (en cualquier botón) | `click_whatsapp` |
| Envía el formulario | `lead_form_submit` |
| El formulario se guarda con éxito | `lead_form_success` |
| Hay un error al enviar | `lead_form_error` |

Esto te permite ver en Google Analytics, por ejemplo, cuántas personas llaman desde el móvil frente a las que rellenan el formulario, o si la mayoría de conversiones vienen del botón flotante o del formulario de contacto.

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
│   ├── layout.tsx              # Metadatos SEO globales + datos de la empresa
│   ├── page.tsx                # Página principal (Hero, Servicios, Cobertura, Proceso, FAQ, Formulario)
│   ├── globals.css             # Estilos y paleta de colores
│   ├── sitemap.ts / robots.ts  # SEO técnico
│   ├── api/leads/route.ts      # Recibe el formulario y lo guarda en Supabase
│   └── politica-privacidad/, condiciones-uso/, proteccion-datos/  # Páginas legales
├── components/
│   ├── icons.tsx                # Iconos propios (sin emojis)
│   ├── Navbar.tsx / LeadForm.tsx / CookieBanner.tsx / FloatingWhatsApp.tsx / GoogleAnalytics.tsx / Reveal.tsx
├── lib/
│   ├── analytics.ts              # Eventos de Google Analytics
│   └── supabase.ts               # Conexión a la base de datos
├── supabase/
│   └── schema.sql                 # Estructura de la base de datos (tabla leads)
└── .env.local.example              # Plantilla de configuración
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
