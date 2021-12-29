import { Command } from 'commander';
import { Publisher, TargetVersion } from './publisher';

type CommanderOptions =
  | {
      commitPrefix?: string;
      tagPrefix?: string;
    }
  | undefined;

const program = new Command();

program
  .command('publish <target-version>')
  .description('publish package')
  .option('-c, --commit-prefix <commit-prefix>', 'commit message prefix for generating CHANGELOG')
  .option('-t, --tag-prefix [tag-prefix]', 'tag name prefix')
  .action((targetVersion: TargetVersion, options: CommanderOptions = {}) => {
    new Publisher(targetVersion, options.commitPrefix, options.tagPrefix).execute().catch((e) => {
      console.error(e);
      process.exit(1);
    });
  });

program.parse(process.argv);
