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

   NEXT_PUBLIC_SITE_URL=https://www.luaidesa.com
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

### Paso 2ter — Las fotos de las baterías (ya no requiere nada manual)

Las fotos se suben directamente desde tu ordenador/móvil al crear o editar una batería. El propio sitio crea automáticamente, la primera vez que subas una foto, el espacio de almacenamiento que necesita en Supabase (bucket `baterias-imagenes`, público) — no tienes que hacer nada en el dashboard de Supabase para esto.

> Si por lo que sea tu plan de Supabase no permite crear buckets automáticamente y ves el error "Bucket not found", créalo tú una vez a mano: Supabase → **Storage** → **"New bucket"** → nombre exacto `baterias-imagenes` → activa **"Public bucket"** → **"Create bucket"**. Es la única situación en la que hace falta este paso manual.

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

### El panel tiene 2 secciones

- **Resumen** (`/panel-control`) — Cuántas solicitudes de grúa (leads) hay y cuántas baterías tienes en catálogo/publicadas.
- **Baterías** (`/panel-control/baterias`) — El catálogo completo: crear, editar, publicar/ocultar, eliminar (una a una o en lote), e importar desde Excel.

> Las llamadas y los clics de WhatsApp **no se guardan en la base de datos** — se miden solo en Google Analytics (ver la sección "Cómo ver los eventos en Google Analytics" más abajo).

### Crear una batería manualmente

1. Ve a **Baterías** → **"+ Nueva batería"**
2. Solo son obligatorios el **Modelo** y la **foto**. Marca, amperaje, precio y si tiene Start-Stop son opcionales
3. En "Foto de la batería", pulsa el botón y elige la imagen directamente desde tu ordenador o móvil (JPG, PNG, WEBP o GIF, máximo 5 MB) — verás una vista previa al momento
4. Marca si quieres que se publique ya o la dejas oculta para revisarla después
5. Pulsa "Crear batería" — la imagen se sube automáticamente y la batería aparece **al instante** en el panel y en `/baterias-coche-madrid` si está publicada (ya no hay ningún retraso)

### Editar, publicar/ocultar o eliminar

- En la tabla de **Baterías**, pulsa **"Editar"** para cambiar cualquier dato. Si no seleccionas una foto nueva, se mantiene la que ya tenía
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

   > **Sobre la columna "imagen" en el Excel**: a diferencia de crear una batería a mano (donde subes el archivo directamente), en la importación masiva la imagen se indica con una URL — adjuntar 50 fotos distintas dentro de un Excel no es viable. Si no tienes las fotos ya alojadas en algún sitio con enlace directo, la forma más rápida es: sube cada foto una vez a tu bucket de Supabase Storage (Storage → `baterias-imagenes` → "Upload file"), haz clic en el archivo subido → "Get URL" → pega ese enlace en la columna "imagen" del Excel.

3. Sube el archivo y pulsa "Importar"
4. Verás cuántas se crearon correctamente y, si alguna fila falló, el motivo exacto (por ejemplo "Falta la imagen (obligatorio)")
5. Todas las importadas se crean **publicadas** por defecto y aparecen **al instante** — puedes ocultarlas después si hace falta revisarlas antes

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

---

## 📧 Email automático por cada solicitud del formulario

Además de guardarse siempre en Supabase (tabla `leads`, esto no ha cambiado), ahora cada envío del formulario **también te llega un email** a tu Gmail con los datos del cliente. Usa [Resend](https://resend.com), un servicio de envío de emails con plan gratuito (3.000 emails/mes) — no necesitas dar tu contraseña de Gmail ni tocar nada de tu cuenta de correo.

### Configurarlo (5 minutos)

1. Ve a [resend.com](https://resend.com) y crea una cuenta gratuita
2. En el menú lateral, ve a **"API Keys"** → **"Create API Key"** → dale un nombre (p.ej. "Gruas Luaidesa") → cópiala (empieza por `re_`)
3. Añade en tu `.env.local` (y en Vercel):
   ```
   RESEND_API_KEY=re_tu_api_key_aqui
   NOTIFICATION_EMAIL=gruasluaidesa@gmail.com
   ```
4. Deja `EMAIL_FROM` tal cual viene en el ejemplo — usa el dominio de pruebas de Resend, que funciona sin configurar nada más
5. Prueba el formulario: te debería llegar un email a `gruasluaidesa@gmail.com` con nombre, teléfono, ciudad, servicio y mensaje del cliente, en segundos

### ¿Y si quiero que el email no diga "onboarding@resend.dev" como remitente?

Es opcional, pero si más adelante quieres que el remitente sea tu propio dominio (por ejemplo `avisos@gruasluaidesa.com`):
1. En Resend → **"Domains"** → **"Add Domain"** → escribe tu dominio
2. Añade los registros DNS que te indique en el panel de tu proveedor de dominio (parecido a conectar el dominio en Vercel)
3. Cuando Resend lo marque como verificado, cambia `EMAIL_FROM` en tus variables de entorno a `Grúas Luaidesa <avisos@tudominio.com>`

### Importante

- Si `RESEND_API_KEY` o `NOTIFICATION_EMAIL` no están configuradas, el sitio **sigue funcionando igual**: el lead se guarda en Supabase de todas formas, simplemente no se envía el email. No es una pieza crítica que pueda romper el formulario.
- Puedes seguir viendo y gestionando todos los leads igualmente desde Supabase → Table Editor → `leads`, con el email como aviso adicional en tiempo real.

---

## 📊 Cómo ver los eventos en Google Analytics

Las llamadas y los clics de WhatsApp (tanto de la grúa como de la tienda de baterías) y los envíos de formulario se miden **solo en Google Analytics** — no se guardan en tu base de datos ni en el panel.

### Ver las visitas y eventos en tiempo real

1. Ve a [analytics.google.com](https://analytics.google.com) y entra en tu propiedad "Grúas Luaidesa"
2. En el menú lateral izquierdo, pulsa **"Informes"** → **"Tiempo real"**
3. Visita tu propia web en otra pestaña (y acepta el banner de cookies) — verás tu visita aparecer en segundos, y si pulsas algún botón de llamar/WhatsApp, el evento aparece en el bloque "Recuento de eventos por nombre de evento"

### Ver el histórico de eventos (no solo en tiempo real)

1. En el menú lateral, ve a **"Informes"** → **"Interacción"** → **"Eventos"**
2. Verás una tabla con todos los nombres de evento y cuántas veces ha ocurrido cada uno en el periodo seleccionado (arriba a la derecha puedes cambiar el rango de fechas)
3. Los eventos que vas a ver son:
   - `click_phone` → clics en botones de llamar (grúa)
   - `click_whatsapp` → clics en botones de WhatsApp (grúa)
   - `click_whatsapp_bateria` → clics en "Consultar por WhatsApp" de una batería, o en "¿Qué batería lleva mi coche?"
   - `lead_form_submit` / `lead_form_success` / `lead_form_error` → envíos del formulario de grúa (intentado / guardado con éxito / con error)

### Ver el detalle de cada evento (qué botón, qué batería...)

Cada evento lleva además una "etiqueta" (por ejemplo, qué botón exacto se pulsó, o el modelo de batería consultado). Para verla en los informes:

1. Ve a **Admin** (icono de engranaje, abajo a la izquierda) → en la columna de la propiedad, **"Definiciones personalizadas"** → **"Dimensiones personalizadas"**
2. Pulsa **"Crear dimensiones personalizadas"**
3. Rellena:
   - **Nombre de la dimensión**: `Etiqueta del evento`
   - **Ámbito**: Evento
   - **Parámetro de evento**: `event_label`
4. Guarda. A partir de aquí (los datos anteriores a crear la dimensión no se pueden recuperar retroactivamente), en **Informes → Interacción → Eventos**, al hacer clic en un evento concreto (por ejemplo `click_whatsapp_bateria`) podrás añadir "Etiqueta del evento" como columna o comparación para ver exactamente qué modelo de batería se consultó cada vez.

### Crear un informe/panel a medida (opcional)

Si quieres un panel visual con estas cifras (por ejemplo, comparar llamadas vs. WhatsApp vs. formularios), en GA4 puedes ir a **"Explorar"** en el menú lateral y crear una "Exploración libre" añadiendo el nombre del evento como dimensión y "Recuento de eventos" como métrica.

---

## 🎯 SEO y posicionamiento local (para salir en Google por "grúa Madrid", "baterías coche Madrid"...)

He reforzado el SEO técnico para que Google entienda bien de qué trata cada página, dónde das servicio, y cómo navega el sitio. Esto es lo que se ha añadido:

- **Datos estructurados (JSON-LD)** en cada página: la empresa, el servicio de grúa, el servicio de baterías, cada producto individual, y las preguntas frecuentes (esto último puede hacer que tus FAQ aparezcan directamente en el buscador de Google, en un desplegable)
- **Migas de pan** (`Inicio > Baterías de coche > Modelo`) visibles y también en formato que Google entiende, para que sepa cómo se relacionan tus páginas entre sí
- **Zonas de cobertura reales** (Madrid capital + Alcalá de Henares, Getafe, Leganés, Alcorcón, Móstoles, Fuenlabrada, Parla, Torrejón de Ardoz, Pozuelo de Alarcón, Majadahonda, Las Rozas, Coslada, Rivas-Vaciamadrid, Valdemoro) declaradas en los datos estructurados — esto ayuda a posicionar también en búsquedas del tipo "grúa en Getafe" o "batería coche Alcorcón", no solo "Madrid"
- Como me confirmaste que no tienes un local físico al que pueda acudir el cliente, **no se muestra ninguna dirección ni coordenadas exactas** — se sigue así la recomendación oficial de Google para negocios de servicio a domicilio (mostrar zona de cobertura, no una dirección de fachada)

### Lo que te toca hacer a ti para posicionar de verdad (esto no lo puede hacer el código solo)

El código ayuda a que Google *entienda* tu web, pero para aparecer arriba en los resultados —sobre todo en el mapa y en búsquedas "cerca de mí"— hace falta esto:

1. **Crea tu Perfil de Empresa en Google** (antes "Google My Business"): ve a [google.com/business](https://www.google.com/business/) → "Gestionar ahora" → elige **"Área de servicio"** (no local físico) → indica las zonas de la lista de arriba → añade tu teléfono, horario 24h, categoría "Servicio de grúa" (y otra ficha o categoría secundaria para baterías si te deja) → sube fotos reales de tus grúas/furgoneta. Esto es probablemente lo que más impacto tiene en aparecer en el mapa de Google
2. **Pide reseñas** a tus clientes reales tras cada servicio (con el enlace directo que te da tu Perfil de Empresa) — el número y calidad de reseñas es uno de los factores más importantes para el posicionamiento local
3. **Verifica el sitio en Google Search Console** (ver más abajo en el checklist) y envía el sitemap
4. **Verifica también en Bing Webmaster Tools** ([bing.com/webmasters](https://www.bing.com/webmasters)) — es gratis y capta parte del tráfico que Google no cubre
5. Cuando tengas los enlaces de Instagram/Facebook, añádelos en `.env.local` (y en Vercel) como `NEXT_PUBLIC_FACEBOOK_URL` y `NEXT_PUBLIC_INSTAGRAM_URL` — se enlazan automáticamente desde los datos estructurados de la empresa (esto refuerza que Google asocie esos perfiles con tu negocio)
6. **Consistencia del nombre/teléfono** en todos los sitios donde aparezcas (Google, Páginas Amarillas, directorios locales, redes sociales) — usa siempre exactamente el mismo teléfono y nombre de empresa; Google penaliza las inconsistencias

### Verificar que los datos estructurados no tienen errores

Cada vez que cambies algo relacionado con SEO, puedes comprobar que Google lo interpreta bien aquí: [Rich Results Test de Google](https://search.google.com/test/rich-results) — pega la URL de tu web (o de una ficha de batería) y te dirá si detecta correctamente la empresa, el producto, las preguntas frecuentes, etc.

---

## 🚦 Paso a paso para generar tráfico — la mejor opción antes de pagar por posicionamiento

Vas a pagar el dominio y quieres invertir en posicionamiento: este es el orden que más rendimiento te va a dar por cada euro, de lo gratis-e-imprescindible a lo que sí conviene pagar.

### Fase 1 — Gratis y obligatorio antes de gastar nada en anuncios (semana 1)

1. **Conecta el dominio** en Vercel (Paso 6 del README) y espera 24-48h a que se propague
2. **Google Search Console** → [search.google.com/search-console](https://search.google.com/search-console) → añade tu dominio → verifica con la etiqueta HTML (pega el código en `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` de tus variables de entorno y redeploy) → una vez verificado, ve a "Sitemaps" y envía `sitemap.xml`
3. **Bing Webmaster Tools** → [bing.com/webmasters](https://www.bing.com/webmasters) → puedes importar directamente la propiedad de Google Search Console en un clic, así que este paso es rápido
4. **Perfil de Empresa en Google** (el más importante para búsquedas locales tipo "grúa cerca de mí") → sección de arriba de este mismo README, tiene el paso a paso completo. Sube al menos 5-10 fotos reales
5. **Pide 5-10 reseñas** a clientes reales ya atendidos, con el enlace directo que te da el Perfil de Empresa — esto pesa más que casi cualquier otra cosa para el posicionamiento local

> Con solo esto, en 1-3 semanas Google ya debería empezar a indexar y mostrar tu web en búsquedas de marca ("Grúas Luaidesa") y algunas búsquedas locales sin competencia.

### Fase 2 — Gratis, pero requiere trabajo continuo (mes 1-3)

Google tarda en confiar en un dominio nuevo — esto no tiene atajos, pero acelera con:

6. **Contenido**: cada cierto tiempo, añade una entrada de blog o página nueva con temas reales que la gente busca — "cuánto cuesta una grúa en Madrid", "cómo saber si mi batería está agotada", "qué hacer si mi coche se queda tirado en la M-30". No hace falta que sea diario; con 1-2 al mes ya suma
7. **Enlaces desde otros sitios** (esto es lo que más cuesta y más vale): date de alta en directorios locales gratuitos (Páginas Amarillas, QDQ, directorios de tu ayuntamiento/zona, asociaciones de talleres/gruistas si las hay) — cada enlace real desde un sitio de tu sector suma
8. **Redes sociales activas** (Instagram/Facebook) con contenido real (servicios hechos, antes/después, zona cubierta) — no posicionan directamente en Google, pero generan tráfico propio y confianza, y Google lo valora indirectamente

### Fase 3 — Cuándo y en qué pagar (a partir de que tengas Fase 1 hecha)

**No pagues por posicionamiento SEO genérico** de agencias que prometen "primera página en 30 días" — con un negocio local nuevo, lo que de verdad funciona y da resultado inmediato es:

1. **Google Ads — Campaña de Búsqueda por palabra clave, con extensión de llamada** — es la opción con mejor retorno para un servicio urgente como una grúa: la gente busca "grúa Madrid urgente" con intención de llamar YA. Configura la campaña para que el objetivo sea la llamada telefónica directamente desde el anuncio (extensión de llamada), no solo clics a la web. Empieza con un presupuesto pequeño (10-20€/día) y ajusta según qué palabras clave convierten
2. **Google Ads — Perfil de Empresa (Local Services / anuncios de Perfil de Empresa)** si tu categoría lo permite en tu país — aparecen justo encima de los resultados normales, muy efectivos para "cerca de mí"
3. Cuando tengas presupuesto para más, añade una **segunda campaña de Google Ads específica para "batería coche Madrid"** — es una búsqueda con intención de compra más racional (no urgente como la grúa), así que puedes usar el botón de WhatsApp de la tienda como conversión objetivo, no solo la llamada
4. **Mide siempre desde Google Analytics** los eventos `click_phone`, `click_whatsapp` y `lead_form_success` (ver la sección de arriba "Cómo ver los eventos en Google Analytics") para saber qué campaña te está trayendo clientes de verdad, no solo clics — así no tiras dinero a palabras clave que traen visitas pero no llamadas

**Evita** por ahora: SEO "premium" de agencias sin resultados garantizables, comprar enlaces masivos (Google penaliza esto), y campañas de Display/Video — para un servicio local urgente, Búsqueda (search) siempre rinde mejor que el resto de formatos de Google Ads.

---

## ✅ Checklist final — no olvides esto antes de dar la web por lanzada

- [ ] Ejecutado `supabase/schema.sql` en Supabase y comprobado que existen las tablas `leads` y `baterias`
- [ ] Creado tu usuario Super Admin en Supabase → Authentication → Users (Paso 2bis)
- [ ] Rellenado `.env.local` con tus datos reales, incluidas `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Configurada tu cuenta de Resend y añadidas `RESEND_API_KEY` y `NOTIFICATION_EMAIL`
- [ ] Probado el formulario de grúa en local (`npm run dev`) y confirmado que el envío aparece en Supabase **y** llega el email a Gmail
- [ ] Probado el login en `/panel-control/login` y creado al menos una batería de prueba
- [ ] Configuradas las mismas variables de entorno en Vercel (Supabase Auth + Resend)
- [ ] Publicado el sitio y probado los botones de llamada/WhatsApp desde el móvil real, tanto en la grúa como en la tienda de baterías
- [ ] Comprobado que `/panel-control` no aparece en ningún menú visible ni en el sitemap público
- [ ] Conectado tu dominio propio (opcional pero recomendado para dar imagen profesional)
- [ ] Verificado el sitio en [Google Search Console](https://search.google.com/search-console) para que aparezca en Google
- [ ] Revisado las páginas legales (`Política de Privacidad`, `Condiciones de Uso`, `Protección de Datos`) con tu gestoría o asesor legal para confirmar razón social, CIF y domicilio fiscal exactos
- [ ] Activado Google Analytics y comprobado que se ven visitas y eventos en tiempo real (tras aceptar el banner de cookies en tu propia visita)
- [ ] Creado tu Perfil de Empresa en Google (área de servicio) con las zonas de cobertura y categoría correctas
- [ ] Comprobados los datos estructurados con el [Rich Results Test de Google](https://search.google.com/test/rich-results) sin errores

---

## 📊 Qué se mide automáticamente en Google Analytics

| Acción del visitante | Evento de Google Analytics |
|---|---|
| Pulsa "Llamar" (grúa) | `click_phone` |
| Pulsa "WhatsApp" (grúa) | `click_whatsapp` |
| Pulsa "Consultar por WhatsApp" (batería) | `click_whatsapp_bateria` |
| Usa "¿Qué batería lleva mi coche?" | `click_whatsapp_bateria` |
| Envía el formulario de grúa | `lead_form_submit` |
| El formulario se guarda con éxito | `lead_form_success` |
| Hay un error al enviar | `lead_form_error` |

Todo esto vive únicamente en Google Analytics (ver la sección de arriba para consultarlo) — no se guarda en tu base de datos ni aparece en el panel de administración.

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
│   ├── api/leads/route.ts              # Recibe el formulario de grúa, lo guarda en Supabase y avisa por email
│   ├── api/admin/baterias/             # CRUD, borrado en lote e importación por Excel (requiere sesión)
│   ├── baterias-coche-madrid/          # Tienda pública (listado con filtros + ficha por batería)
│   ├── panel-control/                  # Panel de administración privado (login, dashboard, CRUD de baterías)
│   └── politica-privacidad/, condiciones-uso/, proteccion-datos/  # Páginas legales
├── components/
│   ├── icons.tsx                        # Iconos propios (sin emojis)
│   ├── Navbar.tsx / Footer.tsx / LeadForm.tsx / CookieBanner.tsx / FloatingWhatsApp.tsx / GoogleAnalytics.tsx / Reveal.tsx
│   ├── BateriaCard.tsx / BateriasStore.tsx / CocheBateriaModal.tsx / BateriaWhatsAppButton.tsx  # Tienda pública
│   └── admin/BateriasTabla.tsx / BateriaForm.tsx / LogoutButton.tsx                              # Panel admin
├── lib/
│   ├── analytics.ts                     # Eventos de Google Analytics (llamadas, WhatsApp, formulario)
│   ├── email.ts                         # Envío del email de aviso (Resend) en cada solicitud de grúa
│   ├── supabase.ts                      # Conexión a la base de datos (leads, baterías) — solo servidor
│   ├── supabase-browser.ts              # Cliente de Auth para el navegador (login/recuperar password)
│   ├── supabase-server.ts               # Cliente de Auth para Server Components / API routes
│   └── admin-auth.ts                    # Comprueba la sesión en las API routes de /api/admin
├── supabase/
│   └── schema.sql                       # Estructura de la base de datos (leads, baterias)
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
- **El listado de baterías está vacío o error, o tarda en actualizarse** → si sigue vacío, casi siempre es porque la tabla `baterias` no existe todavía en tu Supabase: ejecuta la parte de `baterias` de `supabase/schema.sql` (ver Paso 2). Si el problema es que tarda en aparecer una nueva batería, asegúrate de estar usando la última versión del código (ya corregido: ahora se invalida la caché al instante en cada creación/edición/borrado)
- **Al crear una batería me dice "bucket not found" o error al subir la imagen** → te falta crear el bucket `baterias-imagenes` en Supabase Storage marcado como público (ver Paso 2ter)
- **No me llega el email del formulario a Gmail** → revisa que `RESEND_API_KEY` y `NOTIFICATION_EMAIL` estén bien puestas (en local y en Vercel), revisa spam, y comprueba en resend.com → "Logs" si el envío se intentó y qué error dio. Recuerda: aunque el email falle, el lead se guarda igualmente en Supabase
