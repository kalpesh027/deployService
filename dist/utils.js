"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildProject = void 0;
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
function buildProject(id) {
    return new Promise((resolve, reject) => {
        var _a, _b;
        const buildPath = path_1.default.join(__dirname, `output/${id}`);
        console.log(`Building project at path: ${buildPath}`);
        const child = (0, child_process_1.exec)(`cd ${buildPath} && npm install && npm run build`);
        (_a = child.stdout) === null || _a === void 0 ? void 0 : _a.on('data', (data) => {
            console.log('stdout: ' + data);
        });
        (_b = child.stderr) === null || _b === void 0 ? void 0 : _b.on('data', (data) => {
            console.error('stderr: ' + data);
        });
        child.on('close', (code) => {
            if (code === 0) {
                resolve();
            }
            else {
                reject(new Error(`Build process exited with code ${code}`));
            }
        });
    });
}
exports.buildProject = buildProject;
