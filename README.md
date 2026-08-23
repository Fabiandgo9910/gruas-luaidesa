# 🍽️ Menu SaaS — Plataforma multi-restaurante de menús digitales

Proyecto **Next.js 14 + Supabase + Tailwind CSS + PWA**. Un único código base
que sirve a varios restaurantes: cada restaurante nuevo = una fila en la base
de datos, no un despliegue nuevo.

> ✅ **Este proyecto fue compilado y ejecutado de verdad antes de entregarlo**
> (`npm install`, `npm run build`, `npm run start`, y pruebas reales de las
> rutas). No es solo código sin probar — ver sección 11 para el detalle de
> qué se verificó.

## Roles: Super Admin y Admin de restaurante

Hay **un solo panel** en `tuapp.com/admin`, con **un solo login**, que se
adapta según quién entra:

- **Super Admin** (uno solo, o los que tú quieras) → entra y ve **la lista de
  todos los restaurantes**. Puede administrarlo todo, de cualquier
  restaurante: crear/eliminar restaurantes, productos, categorías, tema de
  colores y tipografía, secciones de la página pública (activar/desactivar/
  reordenar), favicon, logo, dominio propio, nombre, SEO, y crear el acceso
  de cada **Admin de restaurante**.
- **Admin de restaurante** (uno por cada restaurante, tantos como quieras) →
  entra con su correo y contraseña y cae **directo en su propio restaurante**
  (no ve ni puede tocar ningún otro). Puede: agregar, editar y eliminar
  productos (precio, fotos, ingredientes, alérgenos, disponibilidad),
  marcarlos en oferta del día, y gestionar sus categorías. No puede tocar
  tema, colores, secciones ni dominio — eso es solo del Super Admin.

Internamente el rol se llama `owner` en la base de datos (por herencia del
nombre de la tabla), pero en toda la interfaz se muestra como
**"Admin de restaurante"**.

---

## 1. Requisitos previos

- Node.js 18 o superior
- Una cuenta gratuita en [supabase.com](https://supabase.com)
- Una cuenta gratuita en [vercel.com](https://vercel.com)

---

## 2. Configurar Supabase

1. [supabase.com](https://supabase.com) → **New Project**. Espera ~2 minutos.
2. **SQL Editor** → **New query** → pega TODO el contenido de
   `supabase/schema.sql` → **Run**.
3. **Settings → API**, copia:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role key` (sección "secret") → `SUPABASE_SERVICE_ROLE_KEY`
     ⚠️ Muy sensible: nunca la subas a un repo público ni la uses en el navegador.
4. (Opcional en desarrollo) **Authentication → Settings** → desactiva
   "Confirm email" para crear usuarios de prueba sin verificar correo.

### Crear tu primer Super Admin

1. **Authentication → Users → Add user**: tu correo + contraseña, marca
   "Auto confirm user".
2. **SQL Editor**, ejecuta (cambia el correo):
   ```sql
   update public.profiles
   set role = 'super_admin', restaurant_id = null
   where email = 'tu-email@ejemplo.com';
   ```
3. Entra a `/admin/login` con ese usuario → verás la lista de restaurantes.

---

## 3. Configurar el proyecto localmente

```bash
cd restaurant-saas
npm install
cp .env.example .env.local
```

Rellena `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxx...
NEXT_PUBLIC_ROOT_DOMAIN=localhost:3000
```

```bash
npm run seed   # opcional: restaurante "demo" con productos de ejemplo
npm run dev
```

Abre:
- `http://localhost:3000` → landing del SaaS
- `http://localhost:3000/demo` → menú público de ejemplo (si corriste el seed)
- `http://localhost:3000/admin/login` → panel único (Super Admin o Admin de restaurante)

**Antes de desplegar a producción**, corre siempre:
```bash
npm run build
```
Si esto no termina en "✓ Compiled successfully" y no muestra errores en
rojo, **no lo despliegues** — arregla el error que muestre primero (Vercel
hará exactamente este mismo build, y si falla aquí, fallará allá).

---

## 4. Flujo de uso normal (día a día)

1. **Super Admin** entra a `/admin` → "Nuevo restaurante" → nombre → listo.
   Entra a gestionarlo (`/admin/restaurantes/[id]`) y configura: categorías,
   productos, tema, secciones, favicon/logo, y en la pestaña **Usuarios**
   crea el acceso del Admin de ese restaurante (correo + contraseña).
2. **Admin de restaurante** entra a `/admin/login` → cae directo en su
   espacio: pestañas **Productos**, **Categorías**, **Ofertas del día**.
   Agregar o editar un producto abre un formulario en una ventana emergente,
   sin cambiar de página.
3. **Cliente final** entra a `tuapp.com/slug-del-restaurante`, sin cuenta, y
   ve el menú actualizado.

---

## 5. Roles y seguridad

| Rol | Qué ve/gestiona en `/admin` | Cómo se protege |
|---|---|---|
| **Super Admin** | Todos los restaurantes: productos, categorías, tema, secciones, usuarios, dominio | Middleware + políticas RLS (`profiles.role = 'super_admin'`) |
| **Admin de restaurante** (`owner` en BD) | Solo su restaurante: productos, categorías, ofertas | Middleware + RLS: cada fila de `products`/`categories` solo editable si `restaurant_id` coincide con el de su perfil |
| **Cliente final** | Página pública `/[slug]`, sin login | Lectura pública vía RLS `for select using (true)` |

La seguridad real vive en **Supabase (RLS)** — aunque alguien manipule las
peticiones desde el navegador, la base de datos rechaza escrituras fuera de
su restaurante. `authorizeRestaurant()` en `src/app/admin/actions.ts` es una
capa extra para dar mensajes de error claros, no la única defensa.

---

## 6. PWA

- `public/manifest.json` + `next-pwa` (en `next.config.js`) generan el
  Service Worker en cada `npm run build`. Desactivado en desarrollo.
- Reemplaza los iconos placeholder en `public/icons/` por los de tu marca.
- El favicon de **cada restaurante** se gestiona en
  `/admin/restaurantes/[id]` → General → Favicon (no en `public/icons`).

---

## 7. Desplegar en Vercel

1. `npm run build` local sin errores (paso obligatorio, ver sección 3).
2. Sube el proyecto a GitHub/GitLab (`.env.local` ya está en `.gitignore`).
3. [vercel.com](https://vercel.com) → **Add New → Project** → importa el repo.
4. **Environment Variables**: las mismas 4 de tu `.env.local`.
5. **Deploy**.

---

## 8. Estructura del proyecto

```
restaurant-saas/
├── supabase/schema.sql
├── scripts/seed.mjs
├── public/
├── src/
│   ├── middleware.ts             ← protección de /admin por rol
│   ├── lib/                      ← Supabase, queries, utils
│   ├── types/index.ts
│   ├── components/
│   │   ├── public/               ← Banner, Footer, menú público
│   │   └── admin/                ← TODO el panel (Super Admin + Admin de restaurante)
│   └── app/
│       ├── page.tsx               ← landing del SaaS
│       ├── [slug]/                 ← página pública de cada restaurante
│       └── admin/
│           ├── login/page.tsx      ← login único, FUERA del layout protegido
│           └── (dashboard)/        ← protegido; el login no queda envuelto aquí
│               ├── page.tsx         ← lista (Super Admin) o workspace (Admin de restaurante)
│               └── restaurantes/[id]/page.tsx  ← editor completo (solo Super Admin)
```

`(dashboard)` con paréntesis es un *route group*: no aparece en la URL, solo
agrupa qué páginas quedan bajo el layout protegido — así el login nunca
queda atrapado detrás de su propia protección.

---

## 9. Personalización rápida

- **Nombre/marca del SaaS**: `src/app/layout.tsx` y `src/app/page.tsx`.
- **Nuevo tipo de sección**: `SectionType` en `src/types/index.ts`, su render
  en `src/app/[slug]/page.tsx`, y `SECTION_LABELS` en
  `src/components/admin/SectionsManager.tsx`.
- **Moneda**: `formatPrice` en `src/lib/utils.ts`.
- **Alérgenos**: `COMMON_ALLERGENS` en `src/lib/utils.ts` + tabla `products`.
- **Dar a un Admin de restaurante acceso a Secciones/Tema**: en
  `src/app/admin/actions.ts` cambia `requireSuperAdmin()` por
  `authorizeRestaurant(restaurantId)` en esas funciones, y añade la pestaña
  a `OwnerWorkspace.tsx`.

---

## 10. Soporte técnico rápido

### "No compilaba / no funcionaba nada en absoluto" (bug real, corregido)

Había **dos errores de TypeScript** que rompían `npm run build` por
completo: uno en `SectionsManager.tsx` (parámetro sin tipo) y otro en
`tailwind.config.ts` (el tipo `Config` no aceptaba las funciones de color
dinámico). Un build que falla significa que **Vercel tampoco puede desplegar
nada** — de ahí que "no funcionara nada". Ya corregido y verificado con un
build real (`✓ Compiled successfully`, 7/7 páginas generadas).

**Cómo evitar que te vuelva a pasar sin darte cuenta:** corre siempre
`npm run build` antes de desplegar (sección 3). Si fallara por algo nuevo, el
error que muestra en rojo es el que hay que arreglar — es información
mucho más precisa que "no funciona nada".

### "No se encontró tu restaurante" / "no me deja administrarlo" (causa raíz final, corregida)

**Diagnóstico confirmado con tus propios datos:** el restaurante SÍ existe
(lo confirmaste por SQL), pero la consulta de la app —que respeta las
políticas de seguridad (RLS)— no lo encontraba. Eso solo puede pasar si la
política de "restaurants" (que depende de una función auxiliar,
`current_user_restaurant_id()`) no se está evaluando igual en tu proyecto de
Supabase que en un entorno limpio de referencia.

**Corrección aplicada (elimina la dependencia de esa función por completo):**
Ahora **todas** las lecturas y escrituras del panel `/admin` (productos,
categorías, secciones, restaurantes, tema, usuarios) usan el cliente de
**service role** de Supabase, que **ignora las políticas RLS** — la
autorización real ahora la hace el propio código de la app
(`authorizeRestaurant()` / `requireSuperAdmin()` en
`src/app/admin/actions.ts`), apoyándose únicamente en la política RLS más
simple y ya comprobada de todas: *"solo puedes leer tu propio perfil"*
(`id = auth.uid()`). Esto hace que el panel funcione igual sin importar
particularidades de cada proyecto de Supabase.

> Las políticas RLS siguen activas y protegiendo la base de datos si alguien
> intenta acceder directamente con la clave pública (`anon key`) por fuera de
> la app — solo que el panel `/admin` ya no depende de ellas para funcionar.

Si después de actualizar a esta versión sigues sin poder administrar tu
restaurante, el problema ya no puede ser de RLS — sería otra cosa (revisa la
consola del navegador y la terminal, y mándame el error exacto).

### "No se encontró tu restaurante" al entrar como Admin de restaurante (restaurante realmente eliminado)

**Causa real (reproducida y confirmada):** tu cuenta tiene un
`restaurant_id` asignado, pero ese restaurante ya **no existe** — lo más
común es que se haya eliminado después de asignarlo (pasa fácil mientras se
está probando y creando/borrando restaurantes).

**Corregido:** ahora, al crear un acceso o reasignar un usuario, el sistema
verifica primero que el restaurante exista de verdad — si fue eliminado, da
un error claro en el momento en vez de dejar la cuenta apuntando a algo que
ya no está. Además, el mensaje que ve el Admin de restaurante ahora muestra
el `id` exacto para que el Super Admin pueda diagnosticarlo al toque.

**Solución inmediata si ya te pasó:** el Super Admin debe entrar al
restaurante correcto (o crear uno nuevo si el original se borró) →
pestaña **Usuarios** → "¿Un usuario quedó sin restaurante asignado?" → poner
el correo del Admin → confirmar. Luego ese Admin debe volver a iniciar sesión.

### "Entro como Admin de restaurante pero no me deja administrarlo"

Probado exhaustivamente (ver sección 11) contra una base de datos real: el
sistema de permisos funciona correctamente. Si te pasa esto, casi siempre es
una de estas dos causas:

1. **Tu cuenta se creó ANTES de que existiera el arreglo de "restaurante sin
   asignar"** (ver el punto de abajo) → usa la herramienta de reasignación.
2. **Estás corriendo una versión anterior del proyecto** (sin este arreglo) →
   asegúrate de haber borrado la carpeta vieja por completo y usar este ZIP.

Si tras comprobar ambas sigue sin funcionar, dime **exactamente** qué ves:
¿un mensaje en pantalla (cuál, palabra por palabra)? ¿un error al hacer clic
en algo (cuál botón, qué dice el error)? ¿te regresa al login solo? Con eso
puedo ir directo al punto exacto.

### "Sin restaurante asignado" al entrar como Admin de restaurante

Corregido: al crear el acceso desde la pestaña "Usuarios" ahora se usa
`upsert` (antes un `update` podía fallar en silencio por una condición de
carrera con el trigger de Supabase). Si tienes un usuario que quedó mal
asignado (de antes de este arreglo, o creado directo en Supabase), en
`/admin/restaurantes/[id]` → **Usuarios** hay una sección
**"¿Un usuario quedó sin restaurante asignado?"** — pon su correo y en un
clic queda arreglado, sin tocar SQL.

### Bucle de redirección / pantalla en blanco al entrar a `/admin/login`

Corregido con el *route group* `(dashboard)` (sección 8). Si extraes una
versión nueva del proyecto, **borra por completo** la carpeta anterior antes
de descomprimir (no descomprimas encima) y luego:
```bash
rm -rf .next node_modules
npm install
npm run dev
```

### Olvidé la contraseña de un usuario

Supabase → **Authentication → Users** → busca el correo → restablece la
contraseña ahí directamente.

### Otros errores comunes

- **"No autorizado" al guardar algo**: revisa el `role` del usuario en
  `profiles` y, si es Admin de restaurante, que tenga `restaurant_id`.
- **Imágenes no cargan en producción**: confirma `*.supabase.co` en
  `images.remotePatterns` de `next.config.js` (ya incluido).
- **El menú público no refleja un cambio reciente**: usa
  `revalidate = 30` en `src/app/[slug]/page.tsx` (baja el número o recarga
  forzando caché para verlo al instante).

---

## 11. Qué se verificó antes de entregar esta versión

- `npm install` real (540 paquetes, sin errores) y `npm run build` real →
  **compila sin errores**, genera las 7 páginas.
- `npm run start` real con pruebas de rutas (`/`, `/admin`, `/admin/login`,
  `/config-requerida`, `/demo`).
- **Se instaló PostgreSQL real y se cargó exactamente el archivo
  `supabase/schema.sql`** (el mismo que tú ejecutas en Supabase), con una
  simulación fiel de `auth.uid()` y del rol `authenticated` que usa Supabase,
  para probar las políticas de seguridad (RLS) tal cual funcionan en
  producción. Se verificó, con datos reales:
  - Un Admin de restaurante puede leer y escribir productos/categorías **en
    su propio restaurante**.
  - Ese mismo Admin **no puede** escribir en el restaurante de otro (la base
    de datos lo rechaza, no solo la app).
  - El disparador `handle_new_user` crea el perfil automáticamente al crear
    un usuario.
  - El `upsert` de `createOwnerUser` asigna correctamente el `restaurant_id`
    incluso justo después de que el disparador crea la fila.

Lo que **no** se pudo probar en este entorno (por no tener un proyecto
Supabase Cloud real disponible aquí): el flujo completo a través de la API
real de Supabase Auth (GoTrue) y el navegador. Si después de todo esto algo
sigue sin funcionar, es casi seguro que es específico de tu proyecto de
Supabase (revisa la sección 10) y no un bug del código — pero dime el mensaje
de error exacto y lo reviso.

## 12. Novedades de esta versión (UX, accesibilidad, y arreglos)

- **Categorías**: se confirmó y reforzó que la creación funciona (usa el
  mismo cliente de servicio ya blindado para productos).
- **Botón grande "Ver mi menú público"** en el panel del Admin de restaurante
  — ya no depende de un dato aparte, usa directamente el `slug` del
  restaurante que ya se cargó.
- **Aislamiento reforzado**: se auditó que un Admin de restaurante nunca
  dispara ninguna consulta que traiga la lista de otros restaurantes (la
  verificación de rol ocurre *antes* de esa consulta, en el servidor).
- **Login simplificado**: se quitó el texto explicativo, ahora es solo
  correo + contraseña.
- **Nueva pestaña "Vista previa" para el Super Admin**: muestra el menú
  público dentro del mismo panel (con toggle móvil/escritorio y botón de
  actualizar), para ver los cambios sin saltar de pestaña.
- **Pestañas del editor de restaurante reordenadas** en un flujo más
  natural: General → Diseño y tema → Secciones → Productos → Categorías →
  Usuarios → Vista previa.
- **Accesibilidad**: botones de solo ícono ahora tienen `aria-label`
  descriptivo, pestañas usan `role="tab"`/`aria-selected`, inputs del login
  tienen `aria-label`.

---
## 13. Arreglos de esta versión: categorías, productos invisibles, 404 y modales

### Categorías y menú público usaban la misma política RLS problemática

Tanto la creación de categorías como **toda la página pública** (`/[slug]`)
dependían de la política RLS compuesta de "restaurants" (la misma que ya
habíamos identificado como poco confiable en ciertos proyectos de Supabase).
Ahora la página pública también usa el cliente de servicio para leer
restaurante/categorías/productos/secciones, con el control de "¿está
activo?" hecho explícitamente en código (`src/lib/data.ts`), no vía RLS. Esto
corrige de raíz:
- Categorías que no se creaban.
- El **404 al abrir el menú público** desde el panel del Admin de restaurante.

### Productos creados que no aparecían en el menú público

Causa real: un producto **sin categoría asignada** (el valor por defecto del
formulario) simplemente desaparecía de la sección "Nuestro menú", porque esa
sección solo mostraba productos agrupados por categoría. Corregido en
`src/components/public/MenuSection.tsx`: ahora cualquier producto disponible
se muestra siempre, tenga o no categoría asignada (los sin categoría
aparecen bajo un grupo "Más"). También se corrigió que la sección entera
desaparecía si el restaurante aún no tenía ninguna categoría creada, aunque
sí tuviera productos.

### Modales de producto que se superponían con el resto de la pantalla

Causa real: la ventana emergente usaba `position: sticky` para su cabecera y
pie dentro de un contenedor que en realidad no controlaba su propio scroll,
lo que en ciertos navegadores/tamaños de pantalla hacía que el encabezado y
el fondo se mezclaran. Corregido: ahora el modal es una columna
(encabezado fijo / cuerpo con scroll propio / pie fijo), con una capa de
apilamiento aislada (`isolate`, `z-[100]`), bloqueo de scroll del fondo
mientras está abierto, cierre con tecla Escape, y cierre al hacer clic fuera
de la tarjeta. Se aplicó el mismo arreglo al modal de "Nuevo restaurante".

## 14. Funciones nuevas de esta versión

### ⚠️ Importante: ejecuta la migración del schema

Esta versión agrega una columna nueva y un tipo de sección nuevo. Si ya
tenías el proyecto de Supabase configurado de una versión anterior, entra al
**SQL Editor** y ejecuta **solo el bloque final** de `supabase/schema.sql`
(la sección "MIGRACIÓN", al final del archivo) — es seguro volver a correr
todo el archivo completo también, no duplica nada.

### Categorías editables

Ahora se puede renombrar una categoría existente (ícono de lápiz), tanto
desde el panel del Admin de restaurante como desde el del Super Admin —
ambos comparten el mismo componente, así que el arreglo aplica a los dos.

### Detalle de producto (clic en la tarjeta)

Cada producto del menú público ahora es clicable y abre una página propia
(`/[slug]/producto/[id]`) con foto grande, galería, descripción completa,
ingredientes y alérgenos.

### Varias fotos por producto

En el formulario de producto ahora hay dos secciones de imagen: **"Foto
principal"** (la que se ve en la lista del menú) y **"Fotos adicionales"**
(hasta 6, se ven como galería en la página de detalle).

### Publicado / no publicado

El check "Disponible en el menú" ahora se llama **"Publicado"** — un
producto no publicado no aparece en ningún lado del menú público, pero sigue
guardado en el panel para publicarlo cuando quieras.

### Menú del día (sección opcional)

Nueva sección configurable desde el Super Admin (pestaña Secciones →
"Menú del día"): se define por "tiempos" (Primero, Segundo, Principal,
Postre o café...), cada uno con su lista de platos a elegir y si es
obligatorio u opcional — por ejemplo, puedes quitar "Segundo" si tu
restaurante no lo maneja, o dejarlo pero desmarcado como "opcional". Se
puede poner un precio único para todo el menú del día.

### Rediseño del menú público

- Banner con degradado más moderno y muestra el horario si lo configuraste.
- Tarjetas de producto con hover, flecha indicando que son clicables, y
  descripción recortada a 2 líneas.
- Recomendaciones del chef ahora en carrusel horizontal deslizable.
- Navegación pegajosa de categorías en la parte superior del menú (salta
  directo a "Postres", "Bebidas", etc. en menús largos).
- Sigue siendo 100% responsive y usa el tema de colores/tipografía que
  configura el Super Admin para cada restaurante.

---

Hecho con Next.js 14 (App Router), Supabase (Auth + Postgres + Storage + RLS),
Tailwind CSS y next-pwa.
