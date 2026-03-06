/**
 * @file constants.ts
 * @description Global constants for the extension.
 * @description Constantes globales de la extensión.
 */

/**
 * List of directory names that the extension should completely ignore during auto-sync.
 * Using a Set improves lookup performance to O(1) when checking paths in file events.
 * * Lista de nombres de directorios que la extensión debe ignorar por completo durante el auto-sync.
 * El uso de un Set mejora el rendimiento de búsqueda a O(1) al verificar rutas en eventos de archivos.
 */
export const IGNORED_FOLDERS = new Set([
    // Dependencies / Dependencias
    'node_modules', 
    
    // Build and compile outputs / Salidas de compilación y empaquetado
    'dist', 
    'build', 
    'out', 
    
    // Testing and coverage / Pruebas y cobertura
    'coverage', 
    
    // Version control / Control de versiones
    '.git', 
    
    // Framework-specific caches / Cachés específicos de frameworks (React, Vue, Svelte, etc.)
    '.next', 
    '.nuxt', 
    '.svelte-kit', 
    
    // Temporary and log files / Archivos temporales y registros
    '.cache', 
    '.temp', 
    'tmp', 
    'logs', 
    
    // IDE and editor configurations / Configuraciones de editores e IDEs
    '.vscode', 
    '.idea'
]);