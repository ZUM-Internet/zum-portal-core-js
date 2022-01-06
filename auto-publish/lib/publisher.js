"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Publisher = void 0;
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const chalk_1 = __importDefault(require("chalk"));
const child_process_1 = require("child_process");
const readline = __importStar(require("readline"));
const finder_1 = require("./finder");
const logGenerator_1 = require("./logGenerator");
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
class Publisher {
    targetVersion;
    commitPrefix;
    tagPrefix;
    packageJsonPath;
    changeLogPath;
    packageJson;
    name;
    currentVersion;
    nextVersion;
    constructor(targetVersion, commitPrefix = '', tagPrefix = '') {
        this.targetVersion = targetVersion;
        this.commitPrefix = commitPrefix;
        this.tagPrefix = tagPrefix;
    }
    parsePackageInfo() {
        this.packageJsonPath = (0, finder_1.findFilePath)(process.cwd(), 'package.json');
        if (!this.packageJsonPath)
            throw new Error("Can't find package.json");
        this.packageJson = require(this.packageJsonPath);
        if (!this.packageJson)
            throw new Error("Can't load package.json");
        this.name = this.packageJson.name;
        this.currentVersion = this.packageJson.version;
        console.log(`\npackage name: ${chalk_1.default.green(this.name)}`);
        console.log(`current version: ${chalk_1.default.green(this.currentVersion)}`);
    }
    setPrefixes() {
        this.commitPrefix = this.commitPrefix || this.name;
        this.tagPrefix = this.tagPrefix || this.commitPrefix;
    }
    getNextVersion() {
        const [major, minor, patch] = this.currentVersion.split('.').map((v) => parseInt(v, 10));
        switch (this.targetVersion) {
            case 'major':
                this.nextVersion = `${major + 1}.${minor}.${patch}`;
                break;
            case 'minor':
                this.nextVersion = `${major}.${minor + 1}.${patch}`;
                break;
            case 'patch':
                this.nextVersion = `${major}.${minor}.${patch + 1}`;
                break;
            default:
                throw new Error('TargetVersion is invalid');
        }
        console.log(`\nNext version: ${chalk_1.default.green(this.nextVersion)}`);
    }
    getProceedInput() {
        return new Promise((resolve) => {
            rl.question('\nproceed? (y/n) ', (answer) => {
                rl.close();
                if (answer.toLowerCase() === 'y')
                    resolve(true);
                else
                    process.exit(0);
            });
        });
    }
    async updatePackageJson() {
        const packageJsonString = await promises_1.default.readFile(this.packageJsonPath, { encoding: 'utf-8' });
        const newPackageJsonString = packageJsonString.replace(/\"version\": \"\d+.\d+.\d+\"/, `"version": "${this.nextVersion}"`);
        await promises_1.default.writeFile(this.packageJsonPath, newPackageJsonString);
        console.log(`\n${chalk_1.default.green('🗸')} package.json was successfully updated`);
    }
    async updateChangeLog() {
        this.changeLogPath = this.packageJsonPath.replace('package.json', 'CHANGELOG.md');
        const changeLog = await new logGenerator_1.LogGenerator(path_1.default.resolve(this.packageJsonPath, '..'), this.nextVersion, this.commitPrefix, this.tagPrefix).execute();
        await promises_1.default.writeFile(this.changeLogPath, changeLog);
        console.log(`\n${chalk_1.default.green('🗸')} CHANGELOG.md was successfully updated`);
    }
    commit() {
        const [commitName] = this.name.split('/').slice(-1);
        (0, child_process_1.execSync)(`git add ${this.changeLogPath}`);
        (0, child_process_1.execSync)(`git add ${this.packageJsonPath}`);
        (0, child_process_1.execSync)(`git commit -m "Publish '${commitName}' v${this.nextVersion}"`);
        console.log(`\n${chalk_1.default.green('🗸')} git commit was successfully created\n`);
    }
    publish() {
        (0, child_process_1.execSync)(`npm publish`);
        console.log(`\n${chalk_1.default.green('🗸')} package was successfully published`);
    }
    pushTag() {
        const tagName = `${this.tagPrefix}/${this.nextVersion}`;
        const tagMessage = `${this.commitPrefix} v${this.nextVersion}`;
        (0, child_process_1.execSync)(`git tag -a ${tagName} -m "${tagMessage}"`);
        console.log(`\n${chalk_1.default.green('🗸')} git tag was successfully created`);
        (0, child_process_1.execSync)(`git push origin ${tagName}`);
        console.log(`\n${chalk_1.default.green('🗸')} git tag was successfully pushed`);
    }
    async execute() {
        this.parsePackageInfo();
        this.setPrefixes();
        this.getNextVersion();
        await this.getProceedInput();
        await this.updatePackageJson();
        await this.updateChangeLog();
        this.commit();
        this.publish();
        this.pushTag();
    }
}
exports.Publisher = Publisher;
