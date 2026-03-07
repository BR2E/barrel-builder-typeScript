/**
 * @file config.ts
 * @description User configuration management (barrel-builder.config.json).
 * @description Manejo de la configuración del usuario (barrel-builder.config.json).
 */

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Interface defining the expected structure of the configuration file.
 * Interfaz que define la estructura esperada del archivo de configuración.
 */
export interface BarrelConfig {
    autoSync: {
        /** Update on file creation / Actualizar al crear archivo */
        onCreate: boolean;
        /** Update on file deletion / Actualizar al borrar archivo */
        onDelete: boolean;
        /** Update on file rename / Actualizar al renombrar archivo */
        onRename: boolean;
    }
}

/**
 * Default configuration object used as a fallback.
 * Objeto de configuración por defecto utilizado como respaldo.
 */
export const DEFAULT_CONFIG: BarrelConfig = {
    autoSync: {
        onCreate: false,
        onDelete: false,
        onRename: false
    }
};

/**
 * Gets the root path of the currently open VS Code workspace.
 * Obtiene la ruta raíz del espacio de trabajo de VS Code actualmente abierto.
 * * @returns {string | undefined} The path string or undefined if no folder is open / La ruta o undefined si no hay carpeta abierta.
 */
export function getWorkspaceRoot(): string | undefined {
    // Retrieve workspace folders provided by the VS Code API
    // Recuperar las carpetas del espacio de trabajo proporcionadas por la API de VS Code
    const workspaceFolders = vscode.workspace.workspaceFolders;
    
    // Return the path of the first open folder
    // Devolver la ruta de la primera carpeta abierta
    if (workspaceFolders && workspaceFolders.length > 0) {
        return workspaceFolders[0].uri.fsPath;
    }
    return undefined;
}

/**
 * Ensures the configuration file exists in the workspace root.
 * If it doesn't exist, it creates one with a bilingual commented template.
 * * Asegura que el archivo de configuración exista en la raíz del espacio de trabajo.
 * Si no existe, crea uno con una plantilla comentada de forma bilingüe.
 */
export function ensureConfigExists(): void {
    const root = getWorkspaceRoot();
    
    // Abort if no workspace is open
    // Abortar si no hay un espacio de trabajo abierto
    if (!root) {
        return;
    }

    const configPath = path.join(root, 'barrel-builder.config.json');
    
    // Only create the file if it does not already exist
    // Solo crear el archivo si este no existe previamente
    if (!fs.existsSync(configPath)) {
        
        // Template String with comments (JSON standard doesn't support comments natively)
        // Cadena de texto con comentarios (El estándar JSON no soporta comentarios nativamente)
        const configTemplate = `{
    "autoSync": {
        "onCreate": false,
        "onDelete": false,
        "onRename": false
    }
}`;

        try {
            // Write to disk synchronously using utf8 encoding
            // Escribir en el disco de forma síncrona usando codificación utf8
            fs.writeFileSync(configPath, configTemplate, 'utf8');
            vscode.window.showInformationMessage('Created barrel-builder.config.json. Please configure your auto-sync preferences. / Se creó barrel-builder.config.json. Por favor, configura tus preferencias de autosincronización.');
        } catch (error) {
            console.error('Error creating config file / Error al crear el archivo de configuración:', error);
        }
    }
}

/**
 * Reads and parses the user's configuration file.
 * Automatically strips out comments to prevent JSON parsing errors.
 * * Lee y analiza el archivo de configuración del usuario.
 * Elimina automáticamente los comentarios para evitar errores de parseo JSON.
 * * @returns {BarrelConfig} The user configuration merged with default fallbacks / La configuración del usuario fusionada con los valores por defecto.
 */
export function getConfig(): BarrelConfig {
    const root = getWorkspaceRoot();
    
    // If no workspace is open, return default configuration safely
    // Si no hay espacio de trabajo abierto, devolver la configuración por defecto de forma segura
    if (!root) {
        return DEFAULT_CONFIG;
    }

    const configPath = path.join(root, 'barrel-builder.config.json');
    
    if (fs.existsSync(configPath)) {
        try {
            // Read the raw content of the file
            // Leer el contenido crudo del archivo
            const content = fs.readFileSync(configPath, 'utf8');
            
            // SECURITY/ROBUSTNESS: Strip out single-line comments (// ...) 
            // This is required because JSON.parse will crash on standard comments.
            // SEGURIDAD/ROBUSTEZ: Eliminar comentarios de una línea (// ...)
            // Esto es necesario porque JSON.parse fallará con comentarios estándar.
            const cleanContent = content.replace(/\/\/.*$/gm, '');
            
            // Parse the cleaned string into a JavaScript object
            // Convertir la cadena limpia en un objeto JavaScript
            const parsed = JSON.parse(cleanContent);
            
            // Merge parsed content with defaults to handle missing keys
            // This prevents the extension from breaking if the user deletes a specific key
            // Combinar el contenido analizado con los valores por defecto para manejar claves faltantes
            // Esto evita que la extensión se rompa si el usuario borra una clave específica
            return {
                autoSync: {
                    ...DEFAULT_CONFIG.autoSync,
                    ...(parsed.autoSync || {})
                }
            };
        } catch (error) {
            // If JSON is totally malformed (e.g., missing a comma), catch the error and return defaults
            // Si el JSON está totalmente mal formado (ej. falta una coma), capturar el error y devolver valores por defecto
            console.error('Error reading config file, using defaults / Error al leer configuración, usando valores por defecto:', error);
        }
    }
    
    // Return defaults if file doesn't exist yet
    // Devolver valores por defecto si el archivo aún no existe
    return DEFAULT_CONFIG;
}