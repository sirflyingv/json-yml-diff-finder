import formatPlain from './formatPlain.js';
import formatStylish from './formatStylish.js';

export default (formatName) => {
  if (formatName === 'plain') return formatPlain;
  if (formatName === 'json') return JSON.stringify;
  return formatStylish;
};
