"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findFilePath = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
function findFilePath(initDir, filename) {
    if (filename.startsWith('/') || filename.startsWith('..')) {
        throw new Error('filename must be just a filename');
    }
    function find(dir, name) {
        const filePath = path_1.default.join(dir, name);
        function nextLevel() {
            if (dir === path_1.default.resolve('/'))
                return null;
            return find(path_1.default.dirname(dir), name);
        }
        try {
            if (fs_1.default.statSync(filePath).isFile())
                return filePath;
            return nextLevel();
        }
        catch (e) {
            return nextLevel();
        }
    }
    return find(initDir, filename);
}
exports.findFilePath = findFilePath;
