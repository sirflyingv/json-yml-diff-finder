import genDiffData from './genDiffData.js';
import chooseFormatter from './formatters/index.js';

const genDiff = (filepath1, filepath2, formatName) => {
  const diffData = genDiffData(filepath1, filepath2);
  const formatDiffData = chooseFormatter(formatName);
  const diff = formatDiffData(diffData);
  return diff;
};

export default genDiff;
