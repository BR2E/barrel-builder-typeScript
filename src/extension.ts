/**
 * @file extension.ts
 * @description Entry point of the extension. Registers VS Code commands and file system events.
 * @description Punto de entrada de la extensión. Registra comandos y eventos del sistema de archivos de VS Code.
 */

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { ensureConfigExists, getConfig } from './config';
import { isSafeToOverwrite, generateBarrel, handleFileChange } from './builder';

/**
 * This method is called when the extension is activated by VS Code.
 * Este método es llamado cuando VS Code activa la extensión.
 * * @param context - The extension context provided by VS Code / El contexto de la extensión proporcionado por VS Code
 */
export function activate(context: vscode.ExtensionContext) {
    // Diagnostic log to confirm successful activation
    // Log de diagnóstico para confirmar la activación exitosa
    console.log('Congratulations, your extension "barrel-builder" is now active!');

    // ==========================================
    // --- MANUAL COMMAND / COMANDO MANUAL ---
    // ==========================================

    // Register the command exposed in package.json to be triggered via context menu
    // Registrar el comando expuesto en package.json para ser disparado vía menú contextual
    const createCommand = vscode.commands.registerCommand('barrel-builder.createBarrel', (uri: vscode.Uri) => {
        
        // 1. Validate that the command was executed on a valid path (right-click)
        // 1. Validar que el comando se ejecutó en una ruta válida (clic derecho)
        if (!uri || !uri.fsPath) {
            vscode.window.showErrorMessage('Please run this command by right-clicking on a folder. / Por favor, ejecuta este comando haciendo clic derecho en una carpeta.');
            return;
        }

        const folderPath = uri.fsPath;
        
        // 2. Ensure the selected item is a directory, not a file
        // 2. Asegurar que el elemento seleccionado sea un directorio, no un archivo
        if (!fs.statSync(folderPath).isDirectory()) {
            vscode.window.showErrorMessage("Please select a valid folder. / Por favor, selecciona una carpeta válida.");
            return;
        }

        const indexPath = path.join(folderPath, 'index.ts');
        
        // 3. Safety check: Prevent overwriting custom manual code in an existing index.ts
        // 3. Control de seguridad: Evitar sobrescribir código manual personalizado en un index.ts existente
        if (fs.existsSync(indexPath) && !isSafeToOverwrite(indexPath)) {
            vscode.window.showWarningMessage('The existing index.ts contains custom code. The barrel was not generated to prevent data loss. / El index.ts existente contiene código personalizado. No se generó el barrel para evitar pérdida de datos.');
            return;
        }

        // 4. Generate the config file right before creating the first barrel (if it doesn't exist)
        // 4. Generar el archivo de configuración justo antes de crear el primer barril (si no existe)
        ensureConfigExists();

        // 5. Generate the barrel and show success UI messages
        // 5. Generar el barril y mostrar mensajes de éxito en la interfaz
        generateBarrel(folderPath, true);
    });

    // ==============================================================
    // --- AUTO BARREL SYNC LISTENERS / LISTENERS DE AUTO-SYNC ---
    // ==============================================================
    
    // Listener for file creation events / Listener para eventos de creación de archivos
    const onCreate = vscode.workspace.onDidCreateFiles(event => {
        // Read config and abort if auto-sync is disabled by the user
        // Leer configuración y abortar si el auto-sync está desactivado por el usuario
        const config = getConfig();
        if (!config.autoSync.onCreate) {
            return;
        }

        // Ignore bulk operations (Git Pull, Folder Paste, Branch Checkout)
        // Ignorar operaciones masivas (Git Pull, Pegar carpetas enteras, Cambio de ramas)
        if (event.files.length > 1) {
            return;
        } 

        // Use a Set to avoid redundant updates if multiple files trigger the event in the same folder
        // Usar un Set para evitar actualizaciones redundantes si varios archivos disparan el evento en la misma carpeta
        const foldersToUpdate = new Set<string>();
        event.files.forEach(file => {
            if (file.fsPath.endsWith('.ts') || file.fsPath.endsWith('.tsx')){
                 foldersToUpdate.add(path.dirname(file.fsPath));
            }
        });

        // Trigger the silent update for affected folders
        // Disparar la actualización silenciosa para las carpetas afectadas
        foldersToUpdate.forEach(folder => handleFileChange(folder));
    });

    // Listener for file deletion events / Listener para eventos de eliminación de archivos
    const onDelete = vscode.workspace.onDidDeleteFiles(event => {
        const config = getConfig();
        if (!config.autoSync.onDelete) {
            return;
        }

        // Ignore bulk operations (Folder Deletion)
        // Ignorar operaciones masivas (Eliminación de carpetas enteras)
        if (event.files.length > 1) {
            return;
        } 

        const foldersToUpdate = new Set<string>();
        event.files.forEach(file => {
            if (file.fsPath.endsWith('.ts') || file.fsPath.endsWith('.tsx')){
                 foldersToUpdate.add(path.dirname(file.fsPath));
            }
        });
        
        foldersToUpdate.forEach(folder => handleFileChange(folder));
    });

    // Listener for file renaming events / Listener para eventos de renombrado de archivos
    const onRename = vscode.workspace.onDidRenameFiles(event => {
        const config = getConfig();
        if (!config.autoSync.onRename) {
            return;
        }

        // Ignore bulk operations (Mass Rename, Folder Move)
        // Ignorar operaciones masivas (Renombrado masivo, Movimiento de carpetas enteras)
        if (event.files.length > 1) {
            return;
        } 

        const foldersToUpdate = new Set<string>();
        
        event.files.forEach(file => {
            const oldIsTarget = file.oldUri.fsPath.endsWith('.ts') || file.oldUri.fsPath.endsWith('.tsx');
            const newIsTarget = file.newUri.fsPath.endsWith('.ts') || file.newUri.fsPath.endsWith('.tsx');

            // Check old path: If the old file was .ts, we must update its origin folder to remove the dead export
            // Revisar ruta antigua: Si era .ts, debemos actualizar su carpeta de origen para borrar el export roto
            if (oldIsTarget) {
                foldersToUpdate.add(path.dirname(file.oldUri.fsPath));
            }
            
            // Check new path: If the new file is .ts, we must update its destination folder to add the new export
            // Revisar ruta nueva: Si es .ts, debemos actualizar su carpeta de destino para añadir el nuevo export
            if (newIsTarget) {
                foldersToUpdate.add(path.dirname(file.newUri.fsPath));
            }
        });

        foldersToUpdate.forEach(folder => handleFileChange(folder));
    });

    // Push all event listeners and commands to context subscriptions to ensure they are cleaned up on deactivation
    // Añadir todos los listeners y comandos a las suscripciones del contexto para asegurar que se limpien al desactivar
    context.subscriptions.push(createCommand, onCreate, onDelete, onRename);
}

/**
 * This method is called when the extension is deactivated.
 * Este método es llamado cuando la extensión se desactiva.
 * Used for memory cleanup or saving states before the extension shuts down.
 * Se usa para limpieza de memoria o guardar estados antes de que la extensión se cierre.
 */
export function deactivate() {}