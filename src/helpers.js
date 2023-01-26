import fs from 'fs';
import path from 'path';

export const addPropR = (obj, propName, propVal) => {
  if (obj.nested === true) {
    const value = obj.value.map((el) => addPropR(el, propName, propVal));
    return { ...obj, [propName]: propVal, value };
  }
  return { ...obj, [propName]: propVal };
};

// can be replaces with lodash
export function isTrueObj(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export const normalizePath = (inputPath) => path.resolve(process.cwd(), inputPath);

export const getExtension = (filename) => filename.split('.').at(-1);

export const getFormat = (filename) => {
  if (getExtension(filename).toLowerCase() === 'json') return 'json';
  if (['yaml', 'yml'].includes(getExtension(filename).toLowerCase())) {
    return 'yaml';
  }
  return null;
};

export const readFile = (filepath) => fs.readFileSync(normalizePath(filepath));
