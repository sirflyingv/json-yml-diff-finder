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

    const result = data.map((el) => {
      function makeLine(field, prefix = ' ') {
        return `${currentIndent}${prefix} ${el.key}: ${iter(el[field], depth + 1)}`;
      }
      const mapping = {
        nested: (makeStr) => makeStr('children'),
        changed: (makeStr) => [makeStr('value1', '-'), makeStr('value2', '+')],
        new: (makeStr) => makeStr('value', '+'),
        deleted: (makeStr) => makeStr('value', '-'),
        not_changed: (makeStr) => makeStr('value'),
      };

      const getLine = mapping[el.type](makeLine);
      return getLine;
    });

    return ['{', ...result.flat(), `${bracketIndent}}`].join('\n');
  };
  return iter(diff, 1);
};

export default formatStylish;
