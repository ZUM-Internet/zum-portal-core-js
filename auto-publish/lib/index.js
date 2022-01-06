"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const publisher_1 = require("./publisher");
const program = new commander_1.Command();
program
    .command('publish <target-version>')
    .description('publish package')
    .option('-c, --commit-prefix <commit-prefix>', 'commit message prefix for generating CHANGELOG')
    .option('-t, --tag-prefix [tag-prefix]', 'tag name prefix')
    .action((targetVersion, options = {}) => {
    new publisher_1.Publisher(targetVersion, options.commitPrefix, options.tagPrefix).execute().catch((e) => {
        console.error(e);
        process.exit(1);
    });
});
program.parse(process.argv);
