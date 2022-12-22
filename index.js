import { Command } from 'commander';
import fs from 'fs';
import _ from 'lodash';

const readJSONFile = (path) => JSON.parse(fs.readFileSync(path));
const getEntriesFromFile = (path) => _.toPairs(readJSONFile(path)).sort();
const getExtension = (path) => path.split('.').at(-1);

export const programGendiff = new Command();

programGendiff
  .name('gendiff')
  .description('Compares two configuration files and shows a difference.')
  .version('0.5.0')
  .argument('<filepath1>', 'path to first file')
  .argument('<filepath2>', 'path to second file')
  .option('-f, --format <type>', 'output format')
  .action(function () {
    const entries1 = getEntriesFromFile(this.args[0]);
    const entries2 = getEntriesFromFile(this.args[1]);

    const expelledEntries = _.differenceWith(entries1, entries2, _.isEqual);
    const newEntries = _.differenceWith(entries2, entries1, _.isEqual);
    const unchangedEntries = _.intersectionWith(entries1, entries2, _.isEqual);

    expelledEntries.forEach((el) => el.push('-'));
    newEntries.forEach((el) => el.push('+'));
    unchangedEntries.forEach((el) => el.push(' '));

    const summary = [...expelledEntries, ...newEntries, ...unchangedEntries].sort();

    const getDiffLine = (entry) => `${entry[2]} ${entry[0]}: ${entry[1]}`;

    console.log('{');
    summary.forEach((el) => console.log(getDiffLine(el)));
    console.log('}');
  });

programGendiff.parse();
