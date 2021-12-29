import path from 'path';
import fs from 'fs/promises';
import chalk from 'chalk';
import { execSync } from 'child_process';
import * as readline from 'readline';
import { findFilePath } from './finder';
import { LogGenerator } from './logGenerator';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

export type TargetVersion = 'major' | 'minor' | 'patch';

export class Publisher {
  private packageJsonPath: string;

  private changeLogPath: string;

  private packageJson: Record<string, any>;

  private name: string;

  private currentVersion: string;

  private nextVersion: string;

  constructor(
    private targetVersion: TargetVersion,
    private commitPrefix: string = '',
    private tagPrefix: string = '',
  ) {}

  private parsePackageInfo() {
    this.packageJsonPath = findFilePath(process.cwd(), 'package.json');

    if (!this.packageJsonPath) throw new Error("Can't find package.json");

    this.packageJson = require(this.packageJsonPath);

    if (!this.packageJson) throw new Error("Can't load package.json");

    this.name = this.packageJson.name;
    this.currentVersion = this.packageJson.version;

    console.log(`\npackage name: ${chalk.green(this.name)}`);
    console.log(`current version: ${chalk.green(this.currentVersion)}`);
  }

  private setPrefixes() {
    this.commitPrefix = this.commitPrefix || this.name;
    this.tagPrefix = this.tagPrefix || this.commitPrefix;
  }

  private getNextVersion() {
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

    console.log(`\nNext version: ${chalk.green(this.nextVersion)}`);
  }

  private getProceedInput() {
    return new Promise((resolve) => {
      rl.question('\nproceed? (y/n) ', (answer) => {
        rl.close();
        if (answer.toLowerCase() === 'y') resolve(true);
        else process.exit(0);
      });
    });
  }

  private async updatePackageJson() {
    const packageJsonString = await fs.readFile(this.packageJsonPath, { encoding: 'utf-8' });
    const newPackageJsonString = packageJsonString.replace(
      /\"version\": \"\d+.\d+.\d+\"/,
      `"version": "${this.nextVersion}"`,
    );

    await fs.writeFile(this.packageJsonPath, newPackageJsonString);

    console.log(`\n${chalk.green('🗸')} package.json was successfully updated`);
  }

  private async updateChangeLog() {
    this.changeLogPath = this.packageJsonPath.replace('package.json', 'CHANGELOG.md');

    const changeLog = await new LogGenerator(
      path.resolve(this.packageJsonPath, '..'),
      this.nextVersion,
      this.commitPrefix,
      this.tagPrefix,
    ).execute();

    await fs.writeFile(this.changeLogPath, changeLog);

    console.log(`\n${chalk.green('🗸')} CHANGELOG.md was successfully updated`);
  }

  private commit() {
    const [commitName] = this.name.split('/').slice(-1);

    execSync(`git add ${this.changeLogPath}`);
    execSync(`git add ${this.packageJsonPath}`);
    execSync(`git commit -m "Publish '${commitName}' v${this.nextVersion}"`);

    console.log(`\n${chalk.green('🗸')} git commit was successfully created\n`);
  }

  private publish() {
    execSync(`npm publish`);

    console.log(`\n${chalk.green('🗸')} package was successfully published`);
  }

  private pushTag() {
    const tagName = `${this.tagPrefix}/${this.nextVersion}`;
    const tagMessage = `${this.commitPrefix} v${this.nextVersion}`;

    execSync(`git tag -a ${tagName} -m "${tagMessage}"`);

    console.log(`\n${chalk.green('🗸')} git tag was successfully created`);

    execSync(`git push origin ${tagName}`);

    console.log(`\n${chalk.green('🗸')} git tag was successfully pushed`);
  }

  public async execute() {
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
