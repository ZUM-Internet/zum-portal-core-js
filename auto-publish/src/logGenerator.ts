import { execSync, exec } from 'child_process';
import gitlog from 'gitlog';

/**
 * 깃 태그와 로그를 이용해서 커밋 로그를 각 버전에 맞게 나누어준다
 */
export class LogGenerator {
  private logs: any[];

  private tags: [string, number][];

  private readonly repoUrl = 'https://github.com/zuminternet/zum-portal-core-js-project';

  constructor(
    private packagePath: string,
    private nextVersion: string,
    private commitPrefix: string,
    private tagPrefix: string,
  ) {}

  private parseGitLogs() {
    const options = {
      repo: this.packagePath,
      all: true,
      nameStatus: false,
      number: 10_000, // 기본값은 10, 넉넉히 1만개로 설정
    };

    this.logs = gitlog(options).filter((log) => log.subject.includes(`[${this.commitPrefix}]`));
  }

  private async parseTagInfo() {
    const tags = execSync('git tag --list --format="%(refname:strip=2)"')
      .toString()
      .split('\n')
      .filter((tag) => tag.includes(this.tagPrefix));

    const promises = tags.map(
      (tag) =>
        new Promise<[string, number]>((resolve, reject) => {
          exec(`git show ${tag} -q`, (err, stdout) => {
            if (err) return reject(err);

            // 배포한 뒤에 태그를 수동으로 추가할 수도 있기 때문에
            // 태그 생성 날짜가 아니라 해당 커밋 생성 날짜를 파싱
            // `git show -q` 명령어로 조회한 뒤, 가장 마지막 "Date: **" 문장을 파싱한다
            const [dateOutput] = stdout
              .split('\n')
              .filter((output) => output.startsWith('Date'))
              .slice(-1);

            if (!dateOutput) return reject(new Error('git show parsing error'));

            const [version] = tag.split('/').slice(-1);
            const date = dateOutput.replace(/Date:\s+/, '').replace('\n', '');

            resolve([version, new Date(date).getTime()]);
          });
        }),
    );

    // 시간 오름차순
    const sortedTags = (await Promise.all(promises)).sort(([, dateA], [, dateB]) => dateA - dateB);

    // 추가될 태그를 직접 추가
    this.tags = [...sortedTags, [this.nextVersion, Infinity]];
  }

  private createChangeLogFragment(version: string, logs: any[]) {
    const changeLog = [];

    // 제목 추가
    changeLog.push(`\n## ${version}`);

    // 로그 내용 추가
    logs.forEach(({ subject, abbrevHash, hash, authorName }) => {
      const commitSubject = subject
        .replace(`[${this.commitPrefix}]`, '')
        .replace(/\s{2,}/g, ' ')
        .trim();

      changeLog.push(`- ${commitSubject} [${abbrevHash}](${this.repoUrl}/commit/${hash}) ${authorName}`);
    });

    return changeLog;
  }

  private generateChangeLog() {
    if (!this.logs || !this.tags) throw new Error('where is log or tag?');

    const contents = this.tags.reduce((result, [version, versionTime]) => {
      const idx = this.logs.findIndex(({ authorDate }) => new Date(authorDate).getTime() <= versionTime);

      // 현재 버전의 로그만 추출
      const currentVersionLogs = this.logs.slice(idx);

      this.logs = this.logs.slice(0, idx);

      result.unshift(...this.createChangeLogFragment(version, currentVersionLogs));

      return result;
    }, []);

    return ['# CHANGELOG', ...contents].join('\n');
  }

  public async execute() {
    this.parseGitLogs();

    await this.parseTagInfo();

    return this.generateChangeLog();
  }
}
