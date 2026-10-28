# Huellas a Casa

Sitio web para presentar perros y gatos que buscan un hogar en Sucre, Bolivia. Proyecto desarrollado con React, TypeScript, React Router y Vite.

## Ejecutar en desarrollo

1. Instala Node.js compatible con la versión de Vite del proyecto.
2. Instala dependencias con `npm install`.
3. Inicia el servidor con `npm run dev`.
4. Antes de publicar, ejecuta `npm run build` y `npm run lint`.

## Funciones actuales

- Catálogo de mascotas con búsqueda y filtros por especie.
- Ficha de cada mascota con historia, características y cuidados veterinarios registrados.
- Consulta por WhatsApp desde la ficha de cada animal.
- Panel para registrar, editar y eliminar perfiles.
- El formulario de imágenes valida el tipo de archivo y su tamaño, y genera una vista previa optimizada.

## Almacenamiento

Los perfiles se guardan en el almacenamiento local del navegador (`localStorage`). Por eso, los cambios realizados en un navegador no se comparten automáticamente con otros dispositivos ni con otros usuarios. No se utiliza Supabase ni una base de datos externa.

El panel de solicitudes todavía no guarda solicitudes: el flujo actual abre WhatsApp con un mensaje preparado. Para registrar y dar seguimiento a solicitudes será necesario implementar un formulario y un sistema de almacenamiento específico.

## Comprobación antes de publicar

- Probar catálogo, búsqueda, filtros, ficha y consulta por WhatsApp.
- Probar el registro, edición y eliminación de perfiles.
- Verificar imágenes y campos de salud con información real confirmada.
- Probar la interfaz en móvil, tablet y escritorio.
- Ejecutar `npm run build` y `npm run lint`.

Los datos de ejemplo son demostrativos; reemplázalos por información real y autorizada antes de utilizar el sitio públicamente.
