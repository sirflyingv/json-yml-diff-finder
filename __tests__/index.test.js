/* eslint-disable no-underscore-dangle */
import fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

import { test, expect } from '@jest/globals';
import genDiffData from '../index.js';
import { formatStylish } from '../src/formatStylish.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) =>
  path.join(__dirname, '..', '__fixtures__', filename);

const readFile = (filename) =>
  fs.readFileSync(getFixturePath(filename), 'utf-8');

test('gendiff stylish', () => {
  const filepath1 = getFixturePath('tree1.yml');
  const filepath2 = getFixturePath('tree2.json');

  const diffData = genDiffData(filepath1, filepath2);
  const result = formatStylish(diffData);
  const expectedResult = readFile('expectedTree.txt');
  expect(result).toEqual(expectedResult);
});
