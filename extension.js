const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log('Extension "create-workspace" is now active!');

  const createWebdevBase = vscode.commands.registerCommand('create-workspace.createWebdevBase', async (uri) => {
    const baseFolder = await getTargetFolder(uri);
    if (!baseFolder) return;

    const folderName = await vscode.window.showInputBox({ prompt: 'Name of the project folder:' });
    if (!folderName) return;

    const targetPath = path.join(baseFolder.fsPath, folderName);
    fs.mkdirSync(targetPath, { recursive: true });

    fs.writeFileSync(path.join(targetPath, 'index.html'), '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <link rel="stylesheet" href="style.css">\n    <title>Document</title>\n</head>\n<body>\n\n\n</body>\n</html>');
    fs.writeFileSync(path.join(targetPath, 'style.css'), 'body {\n  font-family: sans-serif;\n}');
    fs.writeFileSync(path.join(targetPath, 'script.js'), 'console.log("Hello Webdev!");');

    vscode.window.showInformationMessage(`Created Webdev Base in ${folderName}`);
  });

  const HTML = vscode.commands.registerCommand('create-workspace.HTML', async (uri) => {
    const baseFolder = await getTargetFolder(uri);
    if (!baseFolder) return;

    const fileName = await vscode.window.showInputBox({ prompt: 'Name of the HTML file (without .HTML):' });
    if (!fileName) return;

    const mdxPath = path.join(baseFolder.fsPath, `${fileName}.html`);
    const content = '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <link rel="stylesheet" href="style.css">\n    <title>Document</title>\n</head>\n<body>\n\n\n</body>\n</html>';

    fs.writeFileSync(mdxPath, content);

    vscode.window.showInformationMessage(`Created ${fileName}.mdx`);
  });

  context.subscriptions.push(createWebdevBase, HTML);
}

function deactivate() {}

async function getTargetFolder(uri) {
  if (uri && uri.fsPath) {
    return uri;
  }
  const folders = vscode.workspace.workspaceFolders;
  if (!folders || folders.length === 0) {
    vscode.window.showErrorMessage('Please open a workspace folder or use the context menu.');
    return null;
  }
  return folders[0].uri;
}

module.exports = {
  activate,
  deactivate
};
