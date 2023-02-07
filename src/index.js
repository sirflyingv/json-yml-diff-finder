import parseFileData from './parsers.js';
import { normalizePath, getExtension, readFile } from './helpers.js';

import genDiffData from './genDiffData.js';
import formatDiff from './formatters/index.js';

const genDiff = (filepath1, filepath2, formatName = 'stylish') => {
  const path1 = normalizePath(filepath1);
  const fileFormat1 = getExtension(path1);
  const fileData1 = readFile(path1);
  const parsedData1 = parseFileData(fileData1, fileFormat1);

  const path2 = normalizePath(filepath2);
  const fileFormat2 = getExtension(path2);
  const fileData2 = readFile(path2);
  const parsedData2 = parseFileData(fileData2, fileFormat2);

  const diff = genDiffData(parsedData1, parsedData2);
  return formatDiff(formatName, diff);
};

export default genDiff;
