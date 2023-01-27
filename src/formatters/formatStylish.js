import _ from 'lodash';
import { isTrueObj } from '../helpers.js';

// config
const replacer = ' ';
const spaceStep = 4;
const offset = 2;

const formatStylish = (diff) => {
  const iter = (data, depth) => {
    const indentSize = depth * spaceStep;
    const currentIndent = replacer.repeat(indentSize - offset);
    const bracketIndent = replacer.repeat(indentSize - spaceStep);
    // final dead end
    if (!_.isObject(data)) {
      return `${data}`;
    }

    if (isTrueObj(data)) {
      const lines = Object.entries(data).map(([key, value]) => {
        const line = `${currentIndent}  ${key}: ${iter(value, depth + 1)}`;
        return line;
      });
      return ['{', ...lines, `${bracketIndent}}`].join('\n');
    }

    // prettier-ignore
    const mapping = {
      nested: (el) => `${currentIndent}  ${el.key}: ${iter(el.children, depth + 1)}`,
      changed(el) {
        return (
          `${currentIndent}- ${el.key}: ${iter(el.value1, depth + 1)}`
          + '\n'
          + `${currentIndent}+ ${el.key}: ${iter(el.value2, depth + 1)}`
        );
      },
      new: (el) => `${currentIndent}+ ${el.key}: ${iter(el.value, depth + 1)}`,
      deleted: (el) => `${currentIndent}- ${el.key}: ${iter(el.value, depth + 1)}`,
      not_changed(el) {
        return `${currentIndent}  ${el.key}: ${iter(el.value, depth + 1)}`;
      },
    };

    const result = data.map((el) => {
      const makeLine = mapping[el.type];
      return makeLine(el);
    });

    return ['{', ...result, `${bracketIndent}}`].join('\n');
  };
  return iter(diff, 1);
};

export default formatStylish;
