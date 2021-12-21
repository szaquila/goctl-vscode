import * as vscode from 'vscode'
import { GOCTL } from './goctlMode'
import { GoctlDocumentFormattingEditProvider } from './goctlFormat'
import { GoctlDefinitionProvider } from './goctlDeclaration'

export let goctlOutputChannel: vscode.OutputChannel

export function activate(context: vscode.ExtensionContext) {
  if (!goctlOutputChannel) {
    goctlOutputChannel = vscode.window.createOutputChannel('Goctl')
  }
  if (process.env.PATH) {
    goctlOutputChannel.appendLine('$PATH:' + process.env.PATH)
  }
  registerUsualProviders(context)
}

function registerUsualProviders(context: vscode.ExtensionContext) {
  context.subscriptions.push(vscode.languages.registerDefinitionProvider(GOCTL, new GoctlDefinitionProvider()))
  context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider(GOCTL, new GoctlDocumentFormattingEditProvider()))
  context.subscriptions.push(
    vscode.commands.registerCommand('goctl.generateFiles', async (uri) => {
      const apiFile = uri.fsPath
      // let items: vscode.QuickPickItem[] = []
      // items.push({ label: 'api', description: 'generate api related files' })
      // items.push({ label: 'docker', description: 'generate Dockerfile' })
      // items.push({ label: 'kube', description: 'generate kubernetes files' })
      // items.push({ label: 'rpc', description: 'generate rpc code' })
      // items.push({ label: 'model', description: 'generate model code' })
      // items.push({ label: 'template', description: 'template operation' })
      // const chosen: vscode.QuickPickItem | undefined = await vscode.window.showQuickPick(items)
      // if (chosen) {
        const options: vscode.OpenDialogOptions = {
          canSelectMany: false,
          openLabel: 'select target dir ',
          canSelectFiles: false,
          canSelectFolders: true
        }
        vscode.window.showOpenDialog(options).then((uris) => {
					// 获取选择后的结果，然后更新状态栏按钮文本
					// console.log(chosen.label, uris)
          if (uris && uris[0]) {
            const outDir = uris[0].path;
            let terminal = vscode.window.createTerminal({ name: 'goCtl' });
            terminal.show(true);
            terminal.sendText('goctl api go --api ' + apiFile + ' --dir ' + outDir);
          }
        })
      // }
    })
  )
}
