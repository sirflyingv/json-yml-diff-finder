import parseFileData from './parsers.js';
import { getExtension, readFile } from './helpers.js';

import genDiffData from './genDiffData.js';
import formatDiff from './formatters/index.js';

const genDiff = (filepath1, filepath2, formatName = 'stylish') => {
  const fileFormat1 = getExtension(filepath1);
  const fileData1 = readFile(filepath1);
  const parsedData1 = parseFileData(fileData1, fileFormat1);

  const fileFormat2 = getExtension(filepath2);
  const fileData2 = readFile(filepath2);
  const parsedData2 = parseFileData(fileData2, fileFormat2);

  const diff = genDiffData(parsedData1, parsedData2);
  return formatDiff(formatName, diff);
};

export default genDiff;
