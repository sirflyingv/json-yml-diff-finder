import _ from 'lodash';
import { isTrueObj } from '../helpers.js';

// config
const spaceStep = 2;
const depthCoeff = 2; // but why it's 2??? Something wrong
const replacer = ' ';

const formatStylish = (diff) => {
  const iter = (data, depth) => {
    const indentSize = depth * spaceStep;
    const currentIndent = replacer.repeat(indentSize);
    const bracketIndent = replacer.repeat(indentSize - spaceStep);
    // final dead end
    if (!_.isObject(data)) {
      return `${data}`;
    }

    if (isTrueObj(data)) {
      // console.log(currentIndent.length);
      const lines = Object.entries(data).map(
        ([key, value]) =>
          `    ${currentIndent}  ${key}: ${iter(value, depth + depthCoeff)}`,
      );
      return ['{', ...lines, `    ${bracketIndent}}`].join('\n');
    }

    const result = data.map((el) => {
      const addDepth = el.type === 'nested' ? depthCoeff : 0;

      if (el.type === 'nested') {
        return `${currentIndent}  ${el.key}: ${iter(el.children, depth + addDepth)}`;
      }

      if (el.type === 'changed') {
        return `${currentIndent}- ${el.key}: ${iter(
          el.value1,
          depth + addDepth,
        )}\n${currentIndent}+ ${el.key}: ${iter(el.value2, depth + addDepth)}`;
      }

      if (el.type === 'deleted') {
        return `${currentIndent}- ${el.key}: ${iter(el.value, depth + addDepth)}`;
      }

      if (el.type === 'new') {
        return `${currentIndent}+ ${el.key}: ${iter(el.value, depth + addDepth)}`;
      }

      return `${currentIndent}  ${el.key}: ${iter(el.value, depth + addDepth)}`;
    });
    return ['{', ...result, `${bracketIndent}}`].join('\n');
  };
  return iter(diff, 1);
};

export default formatStylish;
