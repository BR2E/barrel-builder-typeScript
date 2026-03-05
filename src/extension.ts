// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "barrel-builder" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    const disposable = vscode.commands.registerCommand('barrel-builder.createBarrel', (uri: vscode.Uri) => {
        
        // Validamos que exista la URI (viene del clic derecho en el explorador)
        if (!uri || !uri.fsPath) {
            vscode.window.showErrorMessage('Por favor, ejecuta este comando haciendo clic derecho en una carpeta.');
            return;
        }

        const folderPath = uri.fsPath;

        // Validamos que el recurso sobre el que se hizo clic sea realmente un directorio
        if (!fs.statSync(folderPath).isDirectory()) {
            vscode.window.showErrorMessage('Por favor, selecciona una carpeta válida.');
            return;
        }

        try {
            const files = fs.readdirSync(folderPath);
            
            // Filtramos archivos .ts, ignorando el propio index.ts y archivos de declaración (.d.ts)
            const tsFiles = files.filter(file => 
                file.endsWith('.ts') && 
                file !== 'index.ts' && 
                !file.endsWith('.d.ts')
            );

            if (tsFiles.length === 0) {
                vscode.window.showInformationMessage('No se encontraron archivos .ts para exportar en esta carpeta.');
                return;
            }

            // Generamos las sentencias de exportación
            const exports = tsFiles.map(file => {
                const fileNameWithoutExt = path.parse(file).name;
                return `export * from './${fileNameWithoutExt}';`;
            });

            // Creamos o sobrescribimos el archivo index.ts
            const indexPath = path.join(folderPath, 'index.ts');
            fs.writeFileSync(indexPath, exports.join('\n') + '\n', 'utf8');

            vscode.window.showInformationMessage(`¡Archivo index.ts creado con ${tsFiles.length} exportaciones!`);
            
        } catch (error) {
            vscode.window.showErrorMessage(`Error al generar el archivo de barril: ${error}`);
        }
    });

    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}