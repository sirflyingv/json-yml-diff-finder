import _ from 'lodash';
// import { isObject } from './parsers.js';

const stringify = (diff, replacer = ' ', spacesCount = 1) => {
  console.log('start', diff);
  // console.log(Array.isArray(diff));
  // console.log(diff.every((el) => el.key));
  const iter = (currentValue, depth) => {
    if (!Array.isArray(currentValue)) {
      if (currentValue.nested === false && !currentValue.value) {
        // console.log('got inside of nested false', currentValue);
        if (currentValue.status === 'deleted') {
          return `- ${currentValue.key}: ${currentValue.file1}`;
        }
        if (currentValue.status === 'new') {
          return `+ ${currentValue.key}: ${currentValue.file2}`;
        }
        if (currentValue.status === 'changed') {
          return `- ${currentValue.key}: ${currentValue.file1} \n + ${currentValue.key}: ${currentValue.file2}`;
        }
        if (currentValue.status === 'not changed') {
          return `  ${currentValue.key}: ${currentValue.file1}`;
        }
      }
      if (
        currentValue.nested === true &&
        currentValue.status === 'new' &&
        !currentValue.value
      ) {
        return `+ ${currentValue.key}: ${currentValue.file2}`;
      }
    }

    const indentSize = depth * spacesCount;
    const currentIndent = replacer.repeat(indentSize);
    const bracketIndent = replacer.repeat(indentSize - spacesCount);

    const sortedCurrentValue = _.orderBy(currentValue, ['key']);

    console.log('before lines', sortedCurrentValue);
    const lines = sortedCurrentValue.map((entry) => {
      console.log('in map', entry);
      if (entry.nested === false) {
        return `${currentIndent}${iter(entry, depth + 1)}`;
      }

      if (entry.nested === true && entry.status === 'changed') {
        return `${currentIndent}${iter(entry, depth + 1)}`;
      }

      return `${currentIndent}${iter(entry.value, depth + 1)}`;
    });
    return ['{', ...lines, `${bracketIndent}}`].join('\n');
  };

  return iter(diff, 1);
};

export default stringify;

const stringifyOld = (value, replacer = ' ', spacesCount = 1) => {
  const iter = (currentValue, depth) => {
    // альтернативный вариант: (typeof currentValue !== 'object' || currentValue === null)
    if (!_.isObject(currentValue)) {
      return `${currentValue}`;
    }

    const indentSize = depth * spacesCount;
    const currentIndent = replacer.repeat(indentSize);
    const bracketIndent = replacer.repeat(indentSize - spacesCount);

    const lines = Object.entries(currentValue).map(
      ([key, val]) => `${currentIndent}${key}: ${iter(val, depth + 1)}`
    );

    return ['{', ...lines, `${bracketIndent}}`].join('\n');
  };

  return iter(value, 1);
};
