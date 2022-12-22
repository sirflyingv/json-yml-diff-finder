import { Command } from 'commander';
import fs from 'fs';
import _ from 'lodash';

const readJSONFile = (path) => JSON.parse(fs.readFileSync(path));

const getEntriesFromFile = (path) => {
  const pairs = _.toPairs(readJSONFile(path)).sort();
  const result = pairs.map((pair) => {
    return { key: pair[0], value: pair[1] };
  });
  return result;
};

// const getExtension = (path) => path.split('.').at(-1);

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

    expelledEntries.forEach((entry) => (entry.mark = '-'));
    newEntries.forEach((entry) => (entry.mark = '+'));
    unchangedEntries.forEach((entry) => (entry.mark = ' '));

    const summary = [...expelledEntries, ...newEntries, ...unchangedEntries];

    const summarySorted = _.orderBy(
      summary,
      [(entry) => entry.key, (entry) => entry.mark],
      ['asc', 'desc']
    );

    const getDiffLine = (entry) => `${entry.mark} ${entry.key}: ${entry.value}`;

    console.log('{');
    summarySorted.forEach((el) => console.log(getDiffLine(el)));
    console.log('}');
  });

programGendiff.parse();
