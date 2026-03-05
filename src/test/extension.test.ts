import * as assert from 'assert';
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

suite('Barrel Builder Test Suite', () => {
    vscode.window.showInformationMessage('Empezando las pruebas de Barrel Builder...');

    let tempDirPath: string;

    // Se ejecuta ANTES de cada prueba: Creamos una carpeta temporal
    setup(() => {
        const tmpBase = os.tmpdir();
        // Crea una carpeta única para no interferir con otras cosas
        tempDirPath = fs.mkdtempSync(path.join(tmpBase, 'barrel-test-'));
    });

    // Se ejecuta DESPUÉS de cada prueba: Borramos la carpeta temporal
    teardown(() => {
        if (fs.existsSync(tempDirPath)) {
            fs.rmSync(tempDirPath, { recursive: true, force: true });
        }
    });

    test('Debe generar index.ts con las exportaciones correctas', async () => {
        // 1. Preparación (Arrange): Creamos archivos de prueba
        fs.writeFileSync(path.join(tempDirPath, 'archivo1.ts'), 'export const a = 1;');
        fs.writeFileSync(path.join(tempDirPath, 'archivo2.ts'), 'export const b = 2;');
        // Archivos que deberían ser ignorados:
        fs.writeFileSync(path.join(tempDirPath, 'script.js'), 'const c = 3;');
        fs.writeFileSync(path.join(tempDirPath, 'tipos.d.ts'), 'export type T = string;');

        const folderUri = vscode.Uri.file(tempDirPath);

        // 2. Acción (Act): Ejecutamos el comando de tu extensión
        await vscode.commands.executeCommand('barrel-builder.createBarrel', folderUri);

        // 3. Verificación (Assert): Comprobamos que el resultado es el esperado
        const indexPath = path.join(tempDirPath, 'index.ts');
        
        // Verificamos que el archivo index.ts fue creado
        assert.ok(fs.existsSync(indexPath), 'El archivo index.ts debería haber sido creado');

        // Verificamos que el contenido es exactamente el que queremos
        const content = fs.readFileSync(indexPath, 'utf8');
        const expectedContent = "export * from './archivo1';\nexport * from './archivo2';\n";
        
        assert.strictEqual(content, expectedContent, 'El contenido del index.ts no es el esperado');
    });

    test('No debe crear index.ts si no hay archivos .ts válidos', async () => {
        // 1. Preparación: Creamos un directorio sin archivos TypeScript válidos
        fs.writeFileSync(path.join(tempDirPath, 'estilos.css'), 'body { color: red; }');
        
        const folderUri = vscode.Uri.file(tempDirPath);

        // 2. Acción: Ejecutamos el comando
        await vscode.commands.executeCommand('barrel-builder.createBarrel', folderUri);

        // 3. Verificación: Asegurarnos de que NO se creó un index.ts inútil
        const indexPath = path.join(tempDirPath, 'index.ts');
        assert.strictEqual(fs.existsSync(indexPath), false, 'No debería crearse un index.ts vacío si no hay archivos .ts');
    });
});