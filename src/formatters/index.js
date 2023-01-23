import formatPlain from './formatPlain.js';
import formatStylish from './formatStylish.js';
import debug from './debug.js';

export default (formatName) => {
  if (formatName === 'plain') return formatPlain;
  if (formatName === 'json') return JSON.stringify;
  if (formatName === 'debug') return debug;
  return formatStylish;
};
