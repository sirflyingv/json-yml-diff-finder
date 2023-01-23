import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import yaml from 'js-yaml';
import { isTrueObj } from './helpers.js';

export const normalizePath = (inputPath) => path.resolve(process.cwd(), inputPath);

export const getExtension = (filename) => filename.split('.').at(-1);

export const getFormat = (filename) => {
  if (getExtension(filename).toLowerCase() === 'json') return 'JSON';
  if (['yaml', 'yml'].includes(getExtension(filename).toLowerCase())) {
    return 'YAML';
  }
  return null;
};

export const readFile = (filepath) => fs.readFileSync(normalizePath(filepath));

const parseJSON = (fileData) => JSON.parse(fileData);
const parseYAML = (fileData) => yaml.load(fileData);

export const parseFileData = (fileData, format) => {
  if (format === 'JSON') return parseJSON(fileData);
  if (format === 'YAML') return parseYAML(fileData);
  return null;
};

export const getRecursiveEntries = (obj) => {
  const keyValuePairs = _.toPairs(obj);

  const entries = keyValuePairs.map((pair) => {
    if (!isTrueObj(pair[1])) {
      return {
        key: pair[0],
        value: pair[1],
      };
    }
    return {
      key: pair[0],
      children: getRecursiveEntries(pair[1]),
    };
  });
  return entries;
};
