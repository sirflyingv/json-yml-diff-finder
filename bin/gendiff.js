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
  .option('-f, --format <format>', 'output format', 'stylish')
  .action((filepath1, filepath2, { format }) => {
    const diff = genDiff(filepath1, filepath2, format);
    console.log(diff);
  });

programGendiff.parse();
