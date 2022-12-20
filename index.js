import { Command } from 'commander';

export const programGendiff = new Command();

programGendiff
  .name('gendiff')
  .description(
    'Compares two configuration files and shows a difference.'
  )
  .version('0.5.0');

programGendiff.parse();
