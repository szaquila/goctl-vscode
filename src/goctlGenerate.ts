import * as vscode from 'vscode';
import cp = require('child_process');

export function generateFiles(uri: vscode.Uri) {
	const apiFile = uri.fsPath;
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
		openLabel: 'select target dir',
		canSelectFiles: false,
		canSelectFolders: true,
	};
	vscode.window.showOpenDialog(options).then(async (uris) => {
		// 获取选择后的结果，然后更新状态栏按钮文本
		// console.log(chosen.label, uris)
		if (uris && uris[0]) {
			const outDir = uris[0].path;

			// const terminals = <vscode.Terminal[]>(<any>vscode.window).terminals
			// let terminal: vscode.Terminal
			// if (
			//   !terminals.some((t) => {
			//     if (t.name === 'goctl') {
			//       terminal = t
			//       return true
			//     }
			//     return false
			//   })
			// ) {
			//   terminal = vscode.window.createTerminal({ name: 'goctl' })
			// }
			// terminal!.show(false)
			// terminal!.sendText('goctl api go --api ' + apiFile + ' --dir ' + outDir)

			const execShell = (cmd: string) =>
				new Promise<string>((resolve, reject) => {
					cp.exec(cmd, (err, out) => {
						if (err) {
							return reject(err);
						}
						return resolve(out);
					});
				});
			const generateFlags = ['goctl', 'api', 'go', '--api', apiFile, '--dir', outDir];
			const output = await execShell(generateFlags.join(' '));
			vscode.window.showInformationMessage(output.replace(RegExp(outDir, 'g'), ''));
		}
	});
	// }
}
