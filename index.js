import { Command } from 'commander';
import fs from 'fs';

export const programGendiff = new Command();

programGendiff
  .name('gendiff')
  .description('Compares two configuration files and shows a difference.')
  .version('0.5.0')
  .argument('<filepath1>', 'path to first file')
  .argument('<filepath2>', 'path to second file')
  .option('-f, --format <type>', 'output format')
  .action(function () {
    console.log(readJSONFile(this.args[0]));
    console.log(readJSONFile(this.args[1]));
  });

programGendiff.parse();

function readJSONFile(path) {
  return JSON.parse(fs.readFileSync(path));
}

function getExtension(path) {
  return path.split('.').at(-1);
}
