# Activar el catálogo compartido (Supabase)

El proyecto ya incluye la integración para guardar mascotas y fotos en la nube. Para que funcione entre celulares hay que conectar un proyecto real de Supabase; no es posible activar una base de datos sin las credenciales del propietario.

## Configuración

1. Crea un proyecto en https://supabase.com/ (puedes usar el plan gratuito).
2. En el panel de Supabase, abre **SQL Editor** y ejecuta todo el archivo `supabase/setup.sql`.
3. En **Project Settings → API**, copia la Project URL y la clave pública **anon** (no uses service_role).
4. En la raíz del proyecto, crea `.env.local` copiando `.env.example` y reemplaza los valores de ejemplo.
5. En el hosting del sitio (por ejemplo, Vercel o Netlify), agrega las mismas variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`, y vuelve a desplegar.
6. Comprueba: registra una mascota en el panel y abre la web en otro celular. El catálogo vuelve a consultar la base de datos cada 10 segundos.

## Importante antes de producción

El inicio de sesión actual es de demostración y se guarda en el navegador. El SQL incluido permite escrituras públicas para que el flujo actual funcione durante pruebas, lo cual significa que cualquier persona técnica podría modificar el catálogo. Antes de usarlo públicamente con datos reales, integrar Supabase Auth y restringir las políticas de escritura a administradores autenticados. Las fotos se almacenan en el bucket público `animal-photos`; no subas datos personales sensibles.
