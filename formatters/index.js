import formatPlain from './formatPlain.js';
import formatStylish from './formatStylish.js';

export default (formatName) => {
  if (formatName === 'stylish') return formatStylish;
  if (formatName === 'plain') return formatPlain;
  throw Error('wrong format name');
};
