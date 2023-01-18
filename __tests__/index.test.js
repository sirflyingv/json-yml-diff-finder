/* eslint-disable no-underscore-dangle */
import fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

import { test, expect } from '@jest/globals';
import genDiff from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) =>
  path.join(__dirname, '..', '__fixtures__', filename);

const readFile = (filename) =>
  fs.readFileSync(getFixturePath(filename), 'utf-8');

test('gendiff stylish', () => {
  const filepath1 = getFixturePath('tree1.yml');
  const filepath2 = getFixturePath('tree2.json');

  const diff = genDiff(filepath1, filepath2, 'stylish');

  const expectedResult = readFile('expectedStylish.txt');
  expect(diff).toEqual(expectedResult);
});

test('gendiff plain', () => {
  const filepath1 = getFixturePath('tree1.yml');
  const filepath2 = getFixturePath('tree2.json');

  const diff = genDiff(filepath1, filepath2, 'plain');

  const expectedResult = readFile('expectedPlain.txt');
  expect(diff).toEqual(expectedResult);
});
