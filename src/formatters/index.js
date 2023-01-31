import formatPlain from './formatPlain.js';
import formatStylish from './formatStylish.js';
import debug from './debug.js';

const mapping = {
  plain: formatPlain,
  json: JSON.stringify,
  stylish: formatStylish,
  debug,
};

const formatDiff = (formatName, diff) => {
  const formatter = mapping[formatName];
  return formatter(diff);
};

export default formatDiff;
