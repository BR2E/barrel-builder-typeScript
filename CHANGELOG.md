# Change Log / Notas de la Versión

All notable changes to the "barrel-builder" extension will be documented in this file. / Todos los cambios notables de la extensión "barrel-builder" serán documentados en este archivo.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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