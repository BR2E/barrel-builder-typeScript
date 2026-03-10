/**
 * @file builder.ts
 * @description Core logic for validation and generation of barrel files.
 * @description Lógica central para la validación y generación de archivos de barril.
 */

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { IGNORED_FOLDERS } from './constants';

/**
 * Validates if an index.ts file is safe to overwrite.
 * It must be completely empty or contain ONLY "export * from '...'" statements.
 * * Valida si un archivo index.ts es seguro para sobrescribir.
 * Debe estar completamente vacío o contener SOLAMENTE sentencias "export * from '...'".
 * * @param indexPath The absolute path to the index.ts file / La ruta absoluta al archivo index.ts
 * @returns boolean - True if safe, False if it contains custom code / True si es seguro, False si tiene código personalizado
 */
export function isSafeToOverwrite(indexPath: string): boolean {
    try {
        const content = fs.readFileSync(indexPath, 'utf8').trim();
        
        // 1. Validation: The file is completely empty
        // 1. Validación: El archivo está completamente vacío
        if (content === '') {
            return true;
        }

        // Split by lines and clean whitespace, ignoring empty lines
        // Dividir por líneas y limpiar espacios, ignorando líneas vacías
        const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        
        // Regular expression to validate: export * from './anything';
        // Expresión regular para validar: export * from './cualquier-cosa';
        // Note: (['"]) captures the quote type, and \1 ensures the closing quote matches it exactly.
        // Nota: (['"]) captura el tipo de comilla, y \1 asegura que la comilla de cierre coincida exactamente.
        const exportRegex = /^export\s+\*\s+from\s+(['"])\.\/[^'"]+\1;?$/;

        // 2. Validation: ALL lines with content must match the export format
        // 2. Validación: TODAS las líneas con contenido deben coincidir con el formato de exportación
        return lines.every(line => exportRegex.test(line));
    } catch (error) {
        // If there's a read error (e.g., permissions), do not touch the file for safety
        // Si hay un error de lectura (ej. permisos), no tocar el archivo por seguridad
        return false;
    }
}

/**
 * Extracts custom directory or subpath exports from an existing index.ts file
 * so they can be preserved when regenerating the barrel.
 * * Extrae exportaciones personalizadas de directorios o subrutas desde un index.ts existente
 * para que puedan conservarse al regenerar el archivo de barril.
 * * @param indexPath Path to the index.ts / Ruta al index.ts
 * @param folderPath Path to the folder containing the index.ts / Ruta a la carpeta que contiene el index.ts
 * @returns Array of preserved export statements / Arreglo de sentencias de exportación conservadas
 */
function getPreservedDirectoryExports(indexPath: string, folderPath: string): string[] {
    const preservedExports: string[] = [];
    
    if (fs.existsSync(indexPath)) {
        try {
            const content = fs.readFileSync(indexPath, 'utf8').trim();
            if (content === '') {
                return preservedExports;
            }

            const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
            
            // Regex with a non-capturing group (?:) for quotes, and a capturing group ([^'"]+) for the path
            // Regex con un grupo de no captura (?:) para comillas, y un grupo de captura ([^'"]+) para la ruta
            const exportRegex = /^export\s+\*\s+from\s+(?:['"])\.\/([^'"]+)(?:['"]);?$/;

            for (const line of lines) {
                const match = line.match(exportRegex);
                if (match && match[1]) {
                    const exportPath = match[1]; // e.g., "components" or "utils/format"
                    const fullTargetPath = path.join(folderPath, exportPath);
                    
                    // Verify if the target actually exists physically on the disk
                    // Verificar si el destino realmente existe físicamente en el disco
                    const isExistingDirectory = fs.existsSync(fullTargetPath) && fs.statSync(fullTargetPath).isDirectory();
                    const isExistingFile = fs.existsSync(fullTargetPath + '.ts') || fs.existsSync(fullTargetPath + '.tsx');

                    // Preserve it only if it doesn't lead to a dead link
                    // Conservarlo solo si no conduce a un enlace roto
                    if (isExistingDirectory || isExistingFile) {
                        preservedExports.push(line);
                    }
                }
            }
        } catch (error) {
            console.error("Error reading existing index.ts:", error);
        }
    }
    return preservedExports;
}

/**
 * Core function to generate/update index.ts in a given folder.
 * Función central para generar/actualizar el index.ts en una carpeta dada.
 * * @param folderPath Target directory path / Ruta del directorio objetivo
 * @param showMessages Whether to show VS Code UI notifications / Si se deben mostrar notificaciones de UI en VS Code
 */
export function generateBarrel(folderPath: string, showMessages: boolean = false) {
    try {
        const files = fs.readdirSync(folderPath);
        const indexPath = path.join(folderPath, 'index.ts');
        
        // 1. Get existing custom exports to avoid deleting user's manual folder exports
        // 1. Obtener exportaciones personalizadas existentes para evitar borrar los exports manuales de carpetas del usuario
        const preservedExports = getPreservedDirectoryExports(indexPath, folderPath);

        // 2. Filter for valid TypeScript files in the root of the folder
        // 2. Filtrar por archivos TypeScript válidos en la raíz de la carpeta
        const tsFiles = files.filter(file => 
            (file.endsWith('.ts') || file.endsWith('.tsx')) && 
            file !== 'index.ts' && 
            file !== 'index.tsx' &&
            !file.endsWith('.d.ts')
        );

        // Filter to avoid duplicate files with the same name but different extensions
        // Filtro para evitar archivos repetidos con el mismo nombre pero diferente extensión (ej. utils.ts y utils.tsx)
        const uniqueBaseNames = new Set<string>();
        const uniqueTsFiles = tsFiles.filter(file => {
            const baseName = path.parse(file).name;
            if (uniqueBaseNames.has(baseName)) {
                return false; 
            }
            uniqueBaseNames.add(baseName);
            return true;
        });

        // 3. Generate standard file export strings
        // 3. Generar cadenas de exportación de archivos estándar
        const fileExports = uniqueTsFiles.map(file => {
            const fileNameWithoutExt = path.parse(file).name;
            return `export * from './${fileNameWithoutExt}';`;
        });

        // 4. Combine both lists (new files + preserved custom exports)
        // 4. Combinar ambas listas (nuevos archivos + exportaciones personalizadas conservadas)
        const allExports = [...fileExports, ...preservedExports];

        // If the folder is effectively empty (no ts files and no preserved folders)
        // Si la carpeta está efectivamente vacía (sin archivos ts y sin carpetas conservadas)
        if (allExports.length === 0) {
            if (showMessages) {
                vscode.window.showInformationMessage("No valid files found to export. / No se encontraron archivos válidos para exportar.");
            }
            
            // Empty the index.ts instead of deleting it, to avoid breaking imports elsewhere
            // Vaciar el index.ts en lugar de borrarlo, para evitar romper importaciones en otros lugares
            fs.writeFileSync(indexPath, '', 'utf8');
            return;
        }

        // 5. Automatic sorting and deduplication using a Set (acts as a second safety net for strings)
        // 5. Ordenamiento automático y deduplicación usando un Set (actúa como segunda red de seguridad para las cadenas)
        const uniqueExports = Array.from(new Set(allExports)).sort();
        
        // 6. Write the final content to the index.ts file
        // 6. Escribir el contenido final en el archivo index.ts
        fs.writeFileSync(indexPath, uniqueExports.join('\n') + '\n', 'utf8');

        // if (showMessages) {
        //     vscode.window.showInformationMessage(`Barrel created successfully with ${uniqueExports.length} exports! / ¡Barrel creado con éxito con ${uniqueExports.length} exportaciones!`);
        // }
    } catch (error) {
        if (showMessages) {
            vscode.window.showErrorMessage(`Error generating barrel file / Error al generar el archivo barrel: ${error}`);
        } else {
            console.error(`Auto-sync error in ${folderPath} / Error de autosincronización en ${folderPath}:`, error);
        }
    }
}

/**
 * Checks if any part of the path belongs to an ignored directory.
 * Verifica si alguna parte de la ruta pertenece a un directorio ignorado.
 */
function isIgnoredPath(folderPath: string): boolean {
    // Split the path by the OS-specific separator (e.g., '/' on Linux/Mac, '\' on Windows)
    // Dividir la ruta por el separador específico del SO
    const pathSegments = folderPath.split(path.sep);
    
    // Check if any segment matches our ignored list (O(1) lookup thanks to the Set)
    // Revisar si algún segmento coincide con nuestra lista de ignorados (Búsqueda O(1) gracias al Set)
    return pathSegments.some(segment => IGNORED_FOLDERS.has(segment));
}

/**
 * Entry point for auto-sync file change events.
 * Checks if a folder needs to be synchronized (if it already has a valid index.ts).
 * * Punto de entrada para eventos de cambio de archivos en autosync.
 * Verifica si una carpeta necesita ser sincronizada (si ya tiene un index.ts válido).
 * * @param folderPath The directory that had a file change / El directorio que tuvo un cambio de archivo
 */
export function handleFileChange(folderPath: string) {
    // 0. OPTIMIZATION: Stop immediately if the folder is in the ignored list
    // 0. OPTIMIZACIÓN: Detenerse inmediatamente si la carpeta está en la lista de ignorados
    if (isIgnoredPath(folderPath)) {
        return;
    }

    const indexPath = path.join(folderPath, 'index.ts');
    
    // 1. Check if index.ts exists
    // 2. Ensure it is a "safe" barrel (empty or only contains exports)
    // Only update if BOTH conditions are met to avoid overwriting manual code.
    
    // 1. Verificar si index.ts existe
    // 2. Asegurar que es un barrel "seguro" (vacío o solo contiene exportaciones)
    // Solo actualizamos si se cumplen AMBAS condiciones para evitar sobrescribir código manual.
    if (fs.existsSync(indexPath) && isSafeToOverwrite(indexPath)) {
        // Execute generation in silent mode (no pop-up messages)
        // Ejecutar la generación en modo silencioso (sin mensajes emergentes)
        generateBarrel(folderPath, false);
    }
}