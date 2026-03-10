# Change Log / Notas de la Versión

All notable changes to the "barrel-builder" extension will be documented in this file. / Todos los cambios notables de la extensión "barrel-builder" serán documentados en este archivo.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.0] - 2026-03-09
### 🇬🇧 English
#### Added
- **Asset Attribution**: Added proper MIT License attribution for AI-generated images used in the extension.

#### Changed
- **Enhanced Export Deduplication**: Improved the barrel generation logic to automatically filter out duplicate files with the same base name but different extensions (e.g., ignoring `utils.tsx` if `utils.ts` is already exported), ensuring cleaner `index.ts` files.

#### Fixed
- **Configuration Formatting**: Fixed an issue where the auto-generated `barrel-builder.config.json` file contained unwanted leading spaces by switching to structured JSON serialization.

### 🇪🇸 Español
#### Añadido
- **Atribución de Recursos**: Se agregó la atribución adecuada bajo la Licencia MIT para las imágenes generadas por IA utilizadas en la extensión.

#### Cambiado
- **Deduplicación de Exportaciones Mejorada**: Se mejoró la lógica de generación de *barrels* para filtrar automáticamente archivos duplicados con el mismo nombre base pero diferente extensión (ej. ignorando `utils.tsx` si `utils.ts` ya está exportado), asegurando archivos `index.ts` más limpios.

#### Corregido
- **Formato de Configuración**: Se solucionó un problema donde el archivo autogenerado `barrel-builder.config.json` contenía espacios iniciales no deseados, cambiando a una serialización estructurada de JSON.

---

---

## [0.0.9] - 2026-03-07
### 🇬🇧 English
#### Added
- **Auto-Ignore Configuration**: Introduced the `addToGitignore` setting (enabled by default) in `barrel-builder.config.json`. The extension now automatically detects the workspace's `.gitignore` file and appends the configuration file to it, preventing accidental commits of local preferences.

### 🇪🇸 Español
#### Añadido
- **Configuración Auto-Ignorada**: Se introdujo la configuración `addToGitignore` (habilitada por defecto) en `barrel-builder.config.json`. La extensión ahora detecta automáticamente el archivo `.gitignore` del espacio de trabajo y le agrega el archivo de configuración, evitando *commits* accidentales de las preferencias locales.

---

---

## [0.0.8] - 2026-03-07
### 🇬🇧 English
#### Fixed
- **Auto-Sync Initialization**: Fixed a lazy-loading issue where background listeners required a manual command to wake up. They now activate automatically via `workspaceContains` events on workspace load.

### 🇪🇸 Español
#### Corregido
- **Inicialización de Auto-Sincronización**: Se corrigió un problema de carga diferida donde los *listeners* en segundo plano requerían un comando manual para despertar. Ahora se activan automáticamente al cargar el espacio de trabajo mediante eventos `workspaceContains`.

---

---

## [0.0.6] - 2026-03-07
### 🇬🇧 English
#### Added
- **React/TSX Support**: Added full support for `.tsx` files. The extension now recognizes and exports components automatically, both in manual generation and auto-sync mode.

### 🇪🇸 Español
#### Añadido
- **Soporte React/TSX**: Se añadió soporte completo para archivos `.tsx`. La extensión ahora reconoce y exporta componentes automáticamente, tanto en la generación manual como en la auto-sincronización.

---

## [0.0.5]
### 🇬🇧 English
#### Added
- **Intelligent Auto-Sync**: Background listeners for `onCreate`, `onDelete`, and `onRename` events to keep barrels updated automatically.
- **Configuration File**: Auto-generation of `barrel-builder.config.json` with bilingual comments (EN/ES) to toggle sync features.
- **Path Preservation**: Logic to identify and safely keep manual exports pointing to subdirectories.
- **Bulk Operation Guard**: Protection system to ignore mass file changes (like Git pulls, branch checkouts, or mass pasting) to maintain editor stability.

#### Changed
- **Modular Architecture**: Fully refactored the source code into a modular structure (`src/` folder) for better performance and maintainability.

#### Fixed
- **Smart Overwrite Protection**: Enhanced the validation engine to detect custom code in existing `index.ts` files and abort safely to prevent data loss.

### 🇪🇸 Español
#### Añadido
- **Auto-Sincronización Inteligente**: Listeners en segundo plano para eventos `onCreate`, `onDelete` y `onRename` para mantener los barriles actualizados.
- **Archivo de Configuración**: Autogeneración de `barrel-builder.config.json` con comentarios bilingües (EN/ES) para gestionar ajustes de sincronización.
- **Conservación de Rutas**: Lógica para identificar y mantener de forma segura las exportaciones manuales a subdirectorios.
- **Protección contra Operaciones Masivas**: Sistema para ignorar cambios masivos de archivos (`git pull`/`merge`/pegar) para garantizar la estabilidad del editor.

#### Cambiado
- **Arquitectura Modular**: Se refactorizó completamente el código fuente en una estructura modular (carpeta `src/`) para un mejor rendimiento y mantenimiento.

#### Corregido
- **Protección Inteligente contra Sobrescritura**: Se mejoró el motor de validación para detectar código personalizado en `index.ts` existentes y abortar para prevenir la pérdida de datos.

---

## [0.0.4]
### 🇬🇧 English
#### Added
- **Documentation**: Added bilingual technical documentation (English/Spanish) following JSDoc standards in the source code.

#### Changed
- **UI Update**: Changed the command title to **"Generate index.ts (Barrel)"** for better clarity in the explorer context menu.
- **Localization**: Updated all VS Code UI error and information pop-up messages to be bilingual (Spanish/English).

### 🇪🇸 Español
#### Añadido
- **Documentación**: Se añadió documentación técnica bilingüe (Inglés/Español) siguiendo los estándares JSDoc en el código fuente.

#### Cambiado
- **Actualización de la Interfaz**: Se cambió el título del comando a **"Generate index.ts (Barrel)"** para mayor claridad en el menú contextual.
- **Localización**: Se actualizaron los mensajes de error e información emergentes para que sean bilingües (Español/Inglés).

---

## [0.0.3]
### 🇬🇧 English / 🇪🇸 Español
#### Changed / Cambiado
- **Category Change**: Updated extension categories in `package.json` to "Programming Languages" for better discoverability. / Se actualizaron las categorías a "Programming Languages" para mejorar la visibilidad.
- **Optimization**: Reduced the demo image size in `README.md` for faster loading in the marketplace. / Se redujo el tamaño de la imagen de demostración para una carga más rápida.

---

## [0.0.2]
### 🇬🇧 English / 🇪🇸 Español
#### Changed / Cambiado
- **Branding**: Updated the extension logo/icon for better visibility. / Se actualizó el logotipo de la extensión para mayor visibilidad.
- **Compatibility**: Updated publisher casing to match Open VSX namespace requirements. / Se actualizó el formato del publicador para coincidir con Open VSX.
- **Documentation**: Minor readability improvements in the README. / Pequeñas mejoras de lectura en el README.

---

## [0.0.1]
### 🇬🇧 English / 🇪🇸 Español
#### Added / Añadido
- Initial release of Barrel Builder. / Lanzamiento inicial de Barrel Builder.
- Core support for automatic `.ts` file exporting via the Explorer context menu. / Soporte principal para exportar automáticamente archivos `.ts` vía menú contextual.