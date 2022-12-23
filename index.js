import { Command } from 'commander';
import fs from 'fs';
import _ from 'lodash';
import path from 'path';

const normalizePath = (inputPath) => path.resolve(process.cwd(), inputPath);

// const getExtension = (path) => path.split('.').at(-1);

const getDataFromJSONFile = (filePath) =>
  JSON.parse(fs.readFileSync(normalizePath(filePath)));

const getEntriesFromJSON = (filePath) => {
  const fileData = getDataFromJSONFile(filePath);
  const keyValuePairs = _.toPairs(fileData);
  const entries = keyValuePairs.map((pair) => ({
    key: pair[0],
    value: pair[1]
  }));
  return entries;
};

export function genDiffJSON(json1, json2) {
  const entries1 = getEntriesFromJSON(json1);
  const entries2 = getEntriesFromJSON(json2);

  const addMarkProp = (obj, mark) => ({ ...obj, mark });

  const differedEntries = _.differenceWith(entries1, entries2, _.isEqual).map(
    (entry) => addMarkProp(entry, '-')
  );
  const newEntries = _.differenceWith(entries2, entries1, _.isEqual).map(
    (entry) => addMarkProp(entry, '+')
  );
  const unchangedEntries = _.intersectionWith(entries1, entries2, _.isEqual).map(
    (entry) => addMarkProp(entry, ' ')
  );

  const summary = [...differedEntries, ...newEntries, ...unchangedEntries];

  const summarySorted = _.orderBy(summary, ['key', 'mark'], ['asc', 'desc']);

  const makeDiffLine = (entry) => `${entry.mark} ${entry.key}: ${entry.value}`;

  const diffString = [
    '{',
    ...summarySorted.map((el) => makeDiffLine(el)),
    '}'
  ].join('\n');
  console.log(diffString);

  return diffString;
}

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
