import * as assert from 'assert';
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

suite('Barrel Builder Test Suite / Suite de pruebas de Barrel Builder', () => {
    vscode.window.showInformationMessage('Starting Barrel Builder tests... / Empezando las pruebas de Barrel Builder...');

    let tempDirPath: string;

    // Runs BEFORE each test: Create a temporary folder
    // Se ejecuta ANTES de cada prueba: Creamos una carpeta temporal
    setup(() => {
        const tmpBase = os.tmpdir();
        // Create a unique folder to avoid interference / Crea una carpeta única para no interferir
        tempDirPath = fs.mkdtempSync(path.join(tmpBase, 'barrel-test-'));
    });

    // Runs AFTER each test: Delete the temporary folder
    // Se ejecuta DESPUÉS de cada prueba: Borramos la carpeta temporal
    teardown(() => {
        if (fs.existsSync(tempDirPath)) {
            fs.rmSync(tempDirPath, { recursive: true, force: true });
        }
    });

    test('Should generate index.ts with correct exports / Debe generar index.ts con las exportaciones correctas', async () => {
        // 1. Arrange: Create test files / Preparación: Creamos archivos de prueba
        fs.writeFileSync(path.join(tempDirPath, 'archivo1.ts'), 'export const a = 1;');
        fs.writeFileSync(path.join(tempDirPath, 'archivo2.ts'), 'export const b = 2;');
        
        // Files that should be ignored / Archivos que deberían ser ignorados:
        fs.writeFileSync(path.join(tempDirPath, 'script.js'), 'const c = 3;');
        fs.writeFileSync(path.join(tempDirPath, 'tipos.d.ts'), 'export type T = string;');

        const folderUri = vscode.Uri.file(tempDirPath);

        // 2. Act: Execute the extension command / Acción: Ejecutamos el comando de la extensión
        await vscode.commands.executeCommand('barrel-builder.createBarrel', folderUri);

        // 3. Assert: Check expected results / Verificación: Comprobamos el resultado esperado
        const indexPath = path.join(tempDirPath, 'index.ts');
        
        // Verify index.ts was created / Verificamos que se creó el archivo
        assert.ok(fs.existsSync(indexPath), 'The index.ts file should have been created / El archivo index.ts debería haber sido creado');

        // Verify content is exact / Verificamos que el contenido es exacto
        const content = fs.readFileSync(indexPath, 'utf8');
        const expectedContent = "export * from './archivo1';\nexport * from './archivo2';\n";
        
        assert.strictEqual(content, expectedContent, 'The index.ts content is not as expected / El contenido del index.ts no es el esperado');
    });

    test('Should create an empty index.ts if no valid .ts files exist / Debe crear un index.ts vacío si no hay archivos .ts válidos', async () => {
        // 1. Arrange: Create a directory with no valid TS files / Preparación: Directorio sin archivos TS válidos
        fs.writeFileSync(path.join(tempDirPath, 'estilos.css'), 'body { color: red; }');
        
        const folderUri = vscode.Uri.file(tempDirPath);

        // 2. Act: Execute command / Acción: Ejecutamos el comando
        await vscode.commands.executeCommand('barrel-builder.createBarrel', folderUri);

        // 3. Assert: Verify it was created but left empty / Verificación: Asegurarnos de que se creó vacío
        // Nota: En la v0.0.5, si no hay exports, vacía el archivo en lugar de borrarlo para evitar romper importaciones.
        const indexPath = path.join(tempDirPath, 'index.ts');
        assert.ok(fs.existsSync(indexPath), 'The index.ts file should exist / El archivo index.ts debería existir');
        
        const content = fs.readFileSync(indexPath, 'utf8');
        assert.strictEqual(content, '', 'The index.ts should be empty / El index.ts debería estar vacío');
    });

    test('Should NOT overwrite index.ts if it contains custom code / NO debe sobrescribir index.ts si contiene código personalizado', async () => {
        // 1. Arrange: Create a custom index.ts / Preparación: Creamos un index.ts personalizado
        const customContent = 'export const myCustomLogic = true;\nconsole.log("Hello");';
        const indexPath = path.join(tempDirPath, 'index.ts');
        fs.writeFileSync(indexPath, customContent);
        
        // Add a valid TS file that would normally be exported / Añadimos un archivo TS válido
        fs.writeFileSync(path.join(tempDirPath, 'archivo1.ts'), 'export const a = 1;');

        const folderUri = vscode.Uri.file(tempDirPath);

        // 2. Act: Execute command / Acción: Ejecutamos el comando
        await vscode.commands.executeCommand('barrel-builder.createBarrel', folderUri);

        // 3. Assert: Content should remain untouched / Verificación: El contenido debe seguir intacto
        const content = fs.readFileSync(indexPath, 'utf8');
        assert.strictEqual(content, customContent, 'Custom code was overwritten! / ¡El código personalizado fue sobrescrito!');
    });

    test('Should preserve manual subdirectory exports / Debe conservar exportaciones manuales de subdirectorios', async () => {
        // 1. Arrange: Create a subfolder and a valid index.ts / Preparación: Subcarpeta e index.ts válido
        const subDirPath = path.join(tempDirPath, 'components');
        fs.mkdirSync(subDirPath); // Create actual directory so validation passes / Crear directorio real
        
        const existingIndexContent = "export * from './components';";
        const indexPath = path.join(tempDirPath, 'index.ts');
        fs.writeFileSync(indexPath, existingIndexContent);
        
        // Add a new file to be merged / Añadir un archivo nuevo para fusionar
        fs.writeFileSync(path.join(tempDirPath, 'archivo1.ts'), 'export const a = 1;');

        const folderUri = vscode.Uri.file(tempDirPath);

        // 2. Act: Execute command / Acción: Ejecutamos el comando
        await vscode.commands.executeCommand('barrel-builder.createBarrel', folderUri);

        // 3. Assert: Both exports should be present / Verificación: Ambas exportaciones deben estar
        const content = fs.readFileSync(indexPath, 'utf8');
        
        // El sort() alfabético pondrá 'archivo1' antes que 'components'
        const expectedContent = "export * from './archivo1';\nexport * from './components';\n";
        
        assert.strictEqual(content, expectedContent, 'Did not preserve subdirectory exports / No conservó las exportaciones del subdirectorio');
    });
});