<div align="right">
  <a href="#barrel-builder-español">🇪🇸 Leer en Español</a> | 🇬🇧 Read in English
</div>

# Barrel Builder

**Barrel Builder** is a practical and lightweight extension for Antigravity / VS Code designed to speed up your TypeScript workflow. It allows you to automatically generate barrel files (`index.ts`) containing exports for all the modules within a specific folder.

![Barrel Builder Demo](images/barrel-builder1.png)

## ✨ Features

* **Fast & Accessible:** Adds a convenient command directly to the File Explorer's context menu (right-click).
* **React/TSX Ready (New):** Fully supports `.tsx` files for seamless integration with React, Next.js, and SolidJS projects.
* **Intelligent Auto-Sync:** Automatically updates your `index.ts` when you create, delete, or rename `.ts` or `.tsx` files.
* **Custom Configuration:** Generates a `barrel-builder.config.json` file in your workspace root (with bilingual EN/ES comments) to toggle sync features on or off.
* **Safe & Non-Destructive:** The extension reads existing `index.ts` files before updating. It will **not** overwrite files containing custom logic, and it intelligently preserves your manual exports pointing to subdirectories.
* **Smart Filtering:** Automatically scans the folder and only considers `.ts/.tsx` files for your exports, while ignoring the `index.ts` file itself (to prevent infinite loops) and type declaration files (`.d.ts`).
* **Performance Optimized:** Automatically ignores bulk operations (like Git pulls, branch checkouts, or mass pasting) to maintain editor performance and stability.

## 🚀 Usage

Using Barrel Builder is extremely simple and integrates naturally into your daily workflow:

1. Open your TypeScript project in the editor.
2. Navigate to the **Explorer** view in the left sidebar.
3. Locate any folder containing your TypeScript/TSX files.
4. **Right-click** directly on the folder name to open the context menu.
5. Look for and click the **"Generate index.ts (Barrel)"** option.
6. **First Run Setup:** A `barrel-builder.config.json` file will be created in your root folder. Set the desired events to `true` to enable automatic synchronization:

| Property | Default | Description |
| :--- | :--- | :--- |
| `onCreate` | `false` | Automatically adds the export when a new `.ts` or `.tsx` file is created. |
| `onDelete` | `false` | Automatically removes the export when a file is deleted. |
| `onRename` | `false` | Updates the export name when a file is renamed or moved. |
| `addToGitignore` | `true` | Automatically appends the configuration file to the workspace's `.gitignore`. |

7. **Done!** An `index.ts` file will be instantly generated inside that folder containing clean `export * from './filename';` statements. If auto-sync is enabled, it will update automatically from now on.

*Note: You can also use this command inside nested directories.*

## ⚙️ Requirements

No special configuration or external dependencies are required. You just need to have a workspace or folder open in your editor to generate the configuration file.

## 🐛 Known Issues

There are no known issues at this time. 

**Safety Note:** In previous versions, the extension would overwrite any `index.ts` file. As of **v0.0.5**, this is no longer an issue. If you run this command on a folder that *already* has an `index.ts` containing custom code or non-barrel logic, the extension will detect it and safely abort the operation to prevent data loss.

## 📝 Release Notes

### 0.1.0
* **Enhanced Export Deduplication**: Improved the barrel generation logic to automatically filter out duplicate files with the same base name but different extensions (e.g., ignoring `utils.tsx` if `utils.ts` is already exported), ensuring cleaner `index.ts` files.
* **Configuration Formatting Fix**: Fixed an issue where the auto-generated `barrel-builder.config.json` file contained unwanted leading spaces by switching to structured JSON serialization.
* **Asset Attribution**: Added proper MIT License attribution for AI-generated images used in the extension.

### 0.0.9
* **Auto-Ignore Configuration**: Added a new `addToGitignore` setting (enabled by default). The extension now automatically detects your workspace's `.gitignore` file and adds `barrel-builder.config.json` to it, preventing accidental commits of your local preferences.

### 0.0.8
* **Auto-Sync Initialization Fix**: Resolved a lazy-loading issue. Auto-sync listeners now activate automatically in the background as soon as you open a TypeScript project, without needing to run the manual command first.

### 0.0.7
* **Marketplace Optimization**: Added a formal `CHANGELOG.md` file to properly display the release history in the extension's "Changes" tab.

### 0.0.6
* **React/TSX Support**: Added support for `.tsx` files in both manual generation and auto-sync listeners.

### 0.0.5
* **Auto Barrel Sync**: Added background listeners for `onCreate`, `onDelete`, and `onRename` events.
* **Configuration System**: Implemented `barrel-builder.config.json` with bilingual comments (EN/ES) to manage auto-sync settings.
* **Smart Overwrite Protection**: Enhanced the validation engine to detect custom code and prevent data loss.
* **Path Preservation**: Added logic to identify and keep manual exports to subdirectories during auto-updates.
* **Bulk Operation Guard**: Implemented checks to ignore mass file changes (Git pulls/merges/paste) for editor stability.
* **Modular Architecture**: Fully refactored the source code into a modular structure (`src/` folder) for better performance and maintainability.

### 0.0.4
* **UI Update**: Changed the command title to **"Generate index.ts (Barrel)"** for better clarity in the context menu.
* **Localization**: Updated error and information messages to be bilingual (Spanish/English).
* **Documentation**: Added bilingual technical documentation (English/Spanish) following JSDoc standards in the source code.

### 0.0.3
* **Category Change**: Updated categories to "Programming Languages" for better discoverability.
* **Optimization**: Reduced the image size in `README.md` for faster loading in the marketplace.

### 0.0.2
* **New Icon**: Updated the extension logo for better visibility.
* **Compatibility**: Updated publisher casing to match Open VSX namespace.
* **Docs**: Minor documentation improvements in README.

### 0.0.1
* Initial release of Barrel Builder.
* Added support for automatic `.ts` file exporting via the Explorer context menu.

<br>
<hr>
<br>

<div align="right">
  <a href="#barrel-builder">🇬🇧 Read in English</a> | 🇪🇸 Leer en Español
</div>

# Barrel Builder Español

**Barrel Builder** es una extensión práctica y ligera para Antigravity / VS Code diseñada para acelerar tu flujo de trabajo en TypeScript. Te permite generar automáticamente archivos de barril (`index.ts`) que contienen las exportaciones de todos los módulos dentro de una carpeta específica.

![Barrel Builder Demo](images/barrel-builder1.png)

## ✨ Características

* **Rápido y Accesible:** Añade un práctico comando directamente al menú contextual del Explorador de Archivos (clic derecho).
* **Preparado para React/TSX (Nuevo):** Soporte total para archivos `.tsx`, ideal para proyectos con React, Next.js y SolidJS.
* **Auto-Sincronización Inteligente:** Actualiza automáticamente tu archivo `index.ts` cuando creas, eliminas o renombras archivos `.ts` o `.tsx`.
* **Configuración Personalizada:** Genera un archivo `barrel-builder.config.json` en la raíz de tu proyecto (con comentarios bilingües EN/ES) para activar o desactivar las funciones de sincronización.
* **Seguro y No Destructivo:** La extensión lee los archivos `index.ts` existentes antes de actualizarlos. **No** sobrescribirá archivos que contengan lógica personalizada y conservará de manera inteligente tus exportaciones manuales que apunten a subdirectorios.
* **Filtrado Inteligente:** Escanea la carpeta y solo considera archivos `.ts/.tsx` para las exportaciones, ignorando el propio archivo `index.ts` (para evitar bucles infinitos) y los archivos de declaración de tipos (`.d.ts`).
* **Rendimiento Optimizado:** Ignora automáticamente operaciones masivas (como `git pull`, cambios de rama o pegado masivo) para mantener el rendimiento y la estabilidad de tu editor.

## 🚀 Uso

Usar Barrel Builder es extremadamente sencillo y se integra de forma natural en tu flujo de trabajo diario:

1. Abre tu proyecto TypeScript en el editor.
2. Navega a la vista del **Explorador** en la barra lateral izquierda.
3. Localiza cualquier carpeta que contenga tus archivos TypeScript/TSX.
4. Haz **clic derecho** directamente sobre el nombre de la carpeta para abrir el menú contextual.
5. Busca y selecciona la opción **"Generate index.ts (Barrel)"**.
6. **Configuración Inicial:** Se creará un archivo `barrel-builder.config.json` en tu carpeta raíz. Configura las propiedades de `autoSync` a `true` para activar la sincronización:

| Propiedad | Por defecto | Descripción |
| :--- | :--- | :--- |
| `onCreate` | `false` | Añade automáticamente la exportación al crear un archivo `.ts` o `.tsx`. |
| `onDelete` | `false` | Elimina automáticamente la exportación al borrar un archivo. |
| `onRename` | `false` | Actualiza la exportación al renombrar o mover un archivo. |
| `addToGitignore` | `true` | Agrega automáticamente el archivo de configuración al `.gitignore` del espacio de trabajo. |

7. **¡Listo!** Se generará instantáneamente un archivo `index.ts` dentro de esa carpeta con las declaraciones limpias `export * from './nombre_del_archivo';`. Si la auto-sincronización está activa, se actualizará automáticamente a partir de ahora.

*Nota: También puedes usar este comando dentro de directorios anidados (subcarpetas).*

## ⚙️ Requisitos

No se requiere ninguna configuración especial ni dependencias externas. Solo necesitas tener un espacio de trabajo o una carpeta abierta en tu editor para poder generar el archivo de configuración.

## 🐛 Problemas Conocidos

No hay problemas conocidos en este momento.

**Nota de Seguridad:** En versiones anteriores, la extensión sobrescribía cualquier archivo `index.ts`. A partir de la **v0.0.5**, esto ya no es un problema. Si ejecutas este comando en una carpeta que *ya* tiene un `index.ts` con código personalizado o lógica distinta a la de un barril, la extensión lo detectará y abortará la operación de forma segura para evitar la pérdida de datos.

## 📝 Notas de la Versión

### 0.1.0
* **Mejora en la deduplicación de exports**: Se mejoró la lógica de generación de *barrels* para filtrar automáticamente archivos duplicados con el mismo nombre base pero diferente extensión (por ejemplo, se ignora `utils.tsx` si `utils.ts` ya está exportado), lo que genera archivos `index.ts` más limpios.
* **Corrección en el formato de configuración**: Se solucionó un problema donde el archivo `barrel-builder.config.json` generado automáticamente contenía espacios iniciales no deseados, cambiando a una serialización estructurada de JSON.
* **Atribución de assets**: Se añadió la atribución correspondiente bajo licencia MIT para las imágenes generadas con IA utilizadas en la extensión.


### 0.0.9
* **Configuración Auto-Ignorada**: Se agregó una nueva configuración `addToGitignore` (habilitada por defecto). La extensión ahora detecta automáticamente el archivo `.gitignore` de tu espacio de trabajo y le agrega `barrel-builder.config.json`, evitando *commits* accidentales de tus preferencias locales.

### 0.0.8
* **Corrección de Inicialización (Auto-Sync)**: Se resolvió un problema de carga diferida (lazy-loading). Los *listeners* de auto-sincronización ahora se activan automáticamente en segundo plano en cuanto abres un proyecto TypeScript, sin necesidad de ejecutar el comando manual previamente.

### 0.0.7
* **Optimización para el Marketplace**: Se añadió un archivo `CHANGELOG.md` formal para mostrar correctamente el historial de versiones en la pestaña "Changes" de la extensión.

### 0.0.6
* **Soporte React/TSX**: Se añadió soporte para archivos `.tsx` tanto en la generación manual como en los listeners de auto-sincronización.

### 0.0.5
* **Auto Barrel Sync**: Se añadieron *listeners* en segundo plano para los eventos `onCreate`, `onDelete` y `onRename`.
* **Sistema de Configuración**: Se implementó el archivo `barrel-builder.config.json` con comentarios bilingües (EN/ES) para gestionar los ajustes de sincronización.
* **Protección Inteligente contra Sobrescritura**: Se mejoró el motor de validación para detectar código personalizado y prevenir la pérdida de datos.
* **Conservación de Rutas**: Se añadió lógica para identificar y mantener las exportaciones manuales a subdirectorios durante las actualizaciones automáticas.
* **Protección contra Operaciones Masivas**: Se implementaron comprobaciones para ignorar cambios masivos de archivos (`git pull`/`merge`/pegar) para garantizar la estabilidad del editor.
* **Arquitectura Modular**: Se refactorizó completamente el código fuente en una estructura modular (carpeta `src/`) para un mejor rendimiento y mantenimiento.

### 0.0.4
* **Actualización de la Interfaz**: Se cambió el título del comando a **"Generate index.ts (Barrel)"** para mayor claridad en el menú contextual.
* **Localización**: Se actualizaron los mensajes de error e información para que sean bilingües (Español/Inglés).
* **Documentación**: Se añadió documentación técnica bilingüe (Inglés/Español) siguiendo los estándares JSDoc en el código fuente.

### 0.0.3
* **Cambio de Categoría**: Se actualizaron las categorías a "Programming Languages" para mejorar la visibilidad de la extensión.
* **Optimización**: Se redujo el tamaño de la imagen en `README.md` para una carga más rápida en el Marketplace.

### 0.0.2
* **Nuevo Icono**: Se actualizó el logotipo de la extensión para darle mayor visibilidad.
* **Compatibilidad**: Se actualizó el formato de mayúsculas y minúsculas del publicador (publisher) para coincidir con Open VSX.
* **Documentación**: Pequeñas mejoras de documentación en el README.

### 0.0.1
* Lanzamiento inicial de Barrel Builder.
* Soporte para la exportación automática de archivos `.ts` a través del menú contextual del Explorador.