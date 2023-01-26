import formatPlain from './formatPlain.js';
import formatStylish from './formatStylish.js';
import debug from './debug.js';

const mapping = {
  plain: formatPlain,
  json: JSON.stringify,
  stylish: formatStylish,
  debug,
};

export default (formatName) => mapping[formatName];
