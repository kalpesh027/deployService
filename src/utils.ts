import { exec } from "child_process";
import path from "path";

export function buildProject(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const buildPath = path.join(__dirname, `output/${id}`);
        console.log(`Building project at path: ${buildPath}`);
        const child = exec(`cd ${buildPath} && npm install && npm run build`);

        child.stdout?.on('data', (data) => {
            console.log('stdout: ' + data);
        });
        child.stderr?.on('data', (data) => {
            console.error('stderr: ' + data);
        });

        child.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Build process exited with code ${code}`));
            }
        });
    });
}
