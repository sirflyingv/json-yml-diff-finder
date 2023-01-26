#!/usr/bin/env node

import { Command } from 'commander';
import genDiff from '../index.js';

const programGendiff = new Command();

programGendiff
  .name('gendiff')
  .description('Compares two configuration files and shows a difference.')
  .version('0.5.0')
  .argument('<filepath1>', 'path to first file')
  .argument('<filepath2>', 'path to second file')
  .option('-f, --format <format>', 'output format')
  .action((filepath1, filepath2, { format = 'stylish' }) => {
    console.log(
      'commander->file1:',
      filepath1,
      'file2:',
      filepath2,
      'format:',
      format,
    );
    const diff = genDiff(filepath1, filepath2, format);
    console.log(diff);
  });

programGendiff.parse();
