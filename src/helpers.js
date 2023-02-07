import fs from 'fs';
import path from 'path';

// can be replaces with lodash
export function isTrueObj(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export const normalizePath = (inputPath) => path.resolve(process.cwd(), inputPath);

export const getExtension = (filename) => filename.split('.').at(-1);

export const readFile = (filepath) => fs.readFileSync(normalizePath(filepath));
