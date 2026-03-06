/**
 * @file barrel-builder.ts
 * @description Extensión de VS Code para generar archivos "barrel" (index.ts).
 * VS Code extension to generate "barrel" files (index.ts).
 */

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Este método se llama cuando se activa la extensión.
 * This method is called when your extension is activated.
 * * @param context El contexto de la extensión proporcionado por VS Code.
 * @param context The extension context provided by VS Code.
 */
export function activate(context: vscode.ExtensionContext) {

    // Log de diagnóstico inicial / Initial diagnostic log
    console.log('Congratulations, your extension "barrel-builder" is now active!');

    /**
     * Registro del comando 'barrel-builder.createBarrel'.
     * Registration of the 'barrel-builder.createBarrel' command.
     */
    const disposable = vscode.commands.registerCommand('barrel-builder.createBarrel', (uri: vscode.Uri) => {
        
        /**
         * Validación: El comando debe ejecutarse desde el menú contextual de una carpeta.
         * Validation: The command must be run from a folder's context menu.
         */
        if (!uri || !uri.fsPath) {
            vscode.window.showErrorMessage('Please run this command by right-clicking on a folder / Por favor, ejecute este comando haciendo clic derecho en una carpeta.');
            return;
        }

        const folderPath = uri.fsPath;

        /**
         * Verificamos que la ruta seleccionada sea efectivamente un directorio.
         * Verify that the selected path is indeed a directory.
         */
        if (!fs.statSync(folderPath).isDirectory()) {
            vscode.window.showErrorMessage("Please select a valid folder / Por favor, seleccione una carpeta válida.");
            return;
        }

        try {
            // Leer el contenido del directorio / Read directory content
            const files = fs.readdirSync(folderPath);
            
            /**
             * Filtramos archivos para exportar:
             * 1. Deben terminar en .ts
             * 2. No deben ser el propio index.ts
             * 3. No deben ser archivos de definición (.d.ts)
             * * Filter files to export:
             * 1. Must end in .ts
             * 2. Must not be index.ts itself
             * 3. Must not be declaration files (.d.ts)
             */
            const tsFiles = files.filter(file => 
                file.endsWith('.ts') && 
                file !== 'index.ts' && 
                !file.endsWith('.d.ts')
            );

            if (tsFiles.length === 0) {
                vscode.window.showInformationMessage("No .ts files were found / No se encontraron archivos .ts para exportar.");
                return;
            }

            /**
             * Generamos las sentencias 'export * from './archivo';' para cada archivo.
             * Generate 'export * from './file';' statements for each file.
             */
            const exports = tsFiles.map(file => {
                const fileNameWithoutExt = path.parse(file).name;
                return `export * from './${fileNameWithoutExt}';`;
            });

            // Definir la ruta del archivo index.ts / Define the index.ts file path
            const indexPath = path.join(folderPath, 'index.ts');
            
            // Escribir el archivo en disco / Write file to disk
            fs.writeFileSync(indexPath, exports.join('\n') + '\n', 'utf8');

            vscode.window.showInformationMessage(`Barrel created successfully with ${tsFiles.length} exports!`);
            
        } catch (error) {
            // Manejo de errores durante la lectura/escritura / Error handling during read/write
            vscode.window.showErrorMessage(`Error generating barrel file: ${error}`);
        }
    });

    // Añadir a las suscripciones para asegurar una limpieza correcta al desactivar
    // Add to subscriptions to ensure proper cleanup on deactivation
    context.subscriptions.push(disposable);
}

/**
 * Este método se llama cuando la extensión se desactiva.
 * This method is called when your extension is deactivated.
 */
export function deactivate() {}