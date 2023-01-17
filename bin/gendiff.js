#!/usr/bin/env node

import { Command } from 'commander';
import genDiffData from '../index.js';
import formatStylish from '../src/formatStylish.js';

const programGendiff = new Command();

programGendiff
  .name('gendiff')
  .description('Compares two configuration files and shows a difference.')
  .version('0.5.0')
  .argument('<filepath1>', 'path to first file')
  .argument('<filepath2>', 'path to second file')
  .option('-f, --format <type>', 'output format')
  .action((filepath1, filepath2, opts) => {
    const diff = genDiffData(filepath1, filepath2);
    formatStylish(diff);
    console.log(opts.format);
  });

programGendiff.parse();
