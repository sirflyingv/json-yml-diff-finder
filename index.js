import { Command } from 'commander';
import fs from 'fs';
import _ from 'lodash';
import path from 'path';

console.log(process.cwd());

const normalizePath = (inputPath) => path.resolve(process.cwd(), inputPath);

const readJSONFile = (path) => JSON.parse(fs.readFileSync(normalizePath(path)));

const getEntriesFromJSON = (path) => {
  const fileData = readJSONFile(path);
  const keyValuePairs = _.toPairs(fileData);
  const entries = keyValuePairs.map((pair) => {
    return { key: pair[0], value: pair[1] };
  });
  return entries;
};

export function genDiffJSON(json1, json2) {
  const entries1 = getEntriesFromJSON(json1);
  const entries2 = getEntriesFromJSON(json2);

  const differedEntries = _.differenceWith(entries1, entries2, _.isEqual);
  const newEntries = _.differenceWith(entries2, entries1, _.isEqual);
  const unchangedEntries = _.intersectionWith(entries1, entries2, _.isEqual);

  differedEntries.forEach((entry) => (entry.mark = '-'));
  newEntries.forEach((entry) => (entry.mark = '+'));
  unchangedEntries.forEach((entry) => (entry.mark = ' '));

  const summary = [...differedEntries, ...newEntries, ...unchangedEntries];

  const summarySorted = _.orderBy(
    summary,
    [(entry) => entry.key, (entry) => entry.mark],
    ['asc', 'desc']
  );

  const getDiffLine = (entry) => `${entry.mark} ${entry.key}: ${entry.value}`;

  console.log('{');
  summarySorted.forEach((el) => console.log(getDiffLine(el)));
  console.log('}');
  return summarySorted;
}

// const getExtension = (path) => path.split('.').at(-1);

export const programGendiff = new Command();

programGendiff
  .name('gendiff')
  .description('Compares two configuration files and shows a difference.')
  .version('0.5.0')
  .argument('<filepath1>', 'path to first file')
  .argument('<filepath2>', 'path to second file')
  .option('-f, --format <type>', 'output format')
  .action(genDiffJSON);

programGendiff.parse();
