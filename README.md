# Barrel Builder

**Barrel Builder** is a practical and lightweight extension for Antigravity / VS Code designed to speed up your TypeScript workflow. It allows you to automatically generate barrel files (`index.ts`) containing exports for all the modules within a specific folder.

![Barrel Builder Demo](images/barrel-builder1.png)

## ✨ Features

* **Fast & Accessible:** Adds a convenient command directly to the File Explorer's context menu (right-click).
* **Smart Filtering:** Automatically scans the folder and only considers `.ts` files for your exports.
* **Safe:** Automatically ignores the `index.ts` file itself (to prevent infinite export loops) and type declaration files (`.d.ts`).
* **Clean:** If no valid TypeScript files are found in the selected folder, the extension will notify you without creating any unnecessary empty files.

## 🚀 Usage

Using Barrel Builder is extremely simple and integrates naturally into your daily workflow:

1. Open your TypeScript project in the editor.
2. Navigate to the **Explorer** view in the left sidebar.
3. Locate any folder containing your TypeScript files (for example, the `src` folder or a specific `components` folder).
4. **Right-click** directly on the folder name to open the context menu.
5. Look for and click the **"Generar index.ts (Barrel)"** option.
6. **Done!** An `index.ts` file will be instantly generated inside that folder. It will contain clean `export * from './filename';` statements for every valid `.ts` file inside.

*Note: You can also use this command inside nested directories.*

## ⚙️ Requirements

No special configuration or external dependencies are required. You just need to have a workspace or folder open in your editor.

## 🐛 Known Issues

There are no known issues at this time. 

**Important:** Please note that if you run this command on a folder that *already* has an `index.ts` file, the extension will overwrite it, replacing its entire content with the newly generated exports.

## 📝 Release Notes

### 0.0.3
* **Category Change**: Updated categories to "Programming Languages" for better discoverability.
* **Optimization**: Reduced the image size in `README.md` for faster loading in the marketplace.

### 0.0.2
* **New Icon**: Updated the extension logo for better visibility.
* **Compatibility**: Updated publisher casing to match Open VSX namespace.
* **Docs**: Minor documentation improvements in README.

### 0.0.1
* Initial release of Barrel Builder.
* Added support for automatic `.ts` file exporting via the Explorer context menu.