"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogGenerator = void 0;
const child_process_1 = require("child_process");
const gitlog_1 = __importDefault(require("gitlog"));
class LogGenerator {
    packagePath;
    nextVersion;
    commitPrefix;
    tagPrefix;
    logs;
    tags;
    repoUrl = 'https://github.com/zuminternet/zum-portal-core-js-project';
    constructor(packagePath, nextVersion, commitPrefix, tagPrefix) {
        this.packagePath = packagePath;
        this.nextVersion = nextVersion;
        this.commitPrefix = commitPrefix;
        this.tagPrefix = tagPrefix;
    }
    gitFetchAll() {
        (0, child_process_1.execSync)('git fetch --all');
    }
    parseGitLogs() {
        const options = {
            repo: this.packagePath,
            all: true,
            nameStatus: false,
            number: 10_000,
        };
        this.logs = (0, gitlog_1.default)(options).filter((log) => log.subject.includes(`[${this.commitPrefix}]`));
    }
    async parseTagInfo() {
        const tags = (0, child_process_1.execSync)('git tag --list --format="%(refname:strip=2)"')
            .toString()
            .split('\n')
            .filter((tag) => tag.includes(this.tagPrefix));
        const promises = tags.map((tag) => new Promise((resolve, reject) => {
            (0, child_process_1.exec)(`git show ${tag} -q`, (err, stdout) => {
                if (err)
                    return reject(err);
                const [dateOutput] = stdout
                    .split('\n')
                    .filter((output) => output.startsWith('Date'))
                    .slice(-1);
                if (!dateOutput)
                    return reject(new Error('git show parsing error'));
                const [version] = tag.split('/').slice(-1);
                const date = dateOutput.replace(/Date:\s+/, '').replace('\n', '');
                resolve([version, new Date(date).getTime()]);
            });
        }));
        const sortedTags = (await Promise.all(promises)).sort(([, dateA], [, dateB]) => dateA - dateB);
        this.tags = [...sortedTags, [this.nextVersion, Infinity]];
    }
    createChangeLogFragment(version, logs) {
        const changeLog = [];
        changeLog.push(`\n## ${version}`);
        logs.forEach(({ subject, abbrevHash, hash, authorName }) => {
            const commitSubject = subject
                .replace(`[${this.commitPrefix}]`, '')
                .replace(/\s{2,}/g, ' ')
                .trim();
            changeLog.push(`- ${commitSubject} [${abbrevHash}](${this.repoUrl}/commit/${hash}) ${authorName}`);
        });
        return changeLog;
    }
    generateChangeLog() {
        if (!this.logs || !this.tags)
            throw new Error('where is log or tag?');
        const contents = this.tags.reduce((result, [version, versionTime]) => {
            const idx = this.logs.findIndex(({ authorDate }) => new Date(authorDate).getTime() <= versionTime);
            const currentVersionLogs = this.logs.slice(idx);
            this.logs = this.logs.slice(0, idx);
            result.unshift(...this.createChangeLogFragment(version, currentVersionLogs));
            return result;
        }, []);
        return ['# CHANGELOG', ...contents].join('\n');
    }
    async execute() {
        this.gitFetchAll();
        this.parseGitLogs();
        await this.parseTagInfo();
        return this.generateChangeLog();
    }
}
exports.LogGenerator = LogGenerator;
