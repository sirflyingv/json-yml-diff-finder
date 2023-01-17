/* eslint-disable no-underscore-dangle */
import fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

import { test, expect } from '@jest/globals';
import { genDiffData, formatStylish } from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) =>
  path.join(__dirname, '..', '__fixtures__', filename);

const readFile = (filename) =>
  fs.readFileSync(getFixturePath(filename), 'utf-8');

// test('gendiff flat JSON', () => {
//   const filepath1 = getFixturePath('file1.json');
//   const filepath2 = getFixturePath('file2.json');

//   const result = genDiffData(filepath1, filepath2);
//   const expectedResult = readFile('expectedResult.txt');

//   expect(result).toEqual(expectedResult);
// });

// test('gendiff flat YAML', () => {
//   const filepath1 = getFixturePath('file1.yml');
//   const filepath2 = getFixturePath('file2.yaml');

//   const result = genDiffData(filepath1, filepath2);
//   const expectedResult = readFile('expectedResult.txt');

//   expect(result).toEqual(expectedResult);
// });

// test('gendiff flat mixed', () => {
//   const filepath1 = getFixturePath('file1.yml');
//   const filepath2 = getFixturePath('file2.json');

//   const result = genDiffData(filepath1, filepath2);
//   const expectedResult = readFile('expectedResult.txt');

//   expect(result).toEqual(expectedResult);
// });

test('gendiff flat', () => {
  const filepath1 = getFixturePath('file1.json');
  const filepath2 = getFixturePath('file2.json');

  const diffData = genDiffData(filepath1, filepath2);
  const resultFlat = formatStylish(diffData);
  const expectedResult = readFile('expectedResult.txt');

  expect(resultFlat).toEqual(expectedResult);
});

test('gendiff nested', () => {
  const filepath1 = getFixturePath('tree1.yml');
  const filepath2 = getFixturePath('tree2.yml');

  const diffData = genDiffData(filepath1, filepath2);
  const result = formatStylish(diffData);
  const expectedResult = readFile('expectedTree.txt');
  console.log(result);
  expect(result).toEqual(expectedResult);
});
