import _ from 'lodash';
import { isTrueObj } from '../helpers.js';

// config
const replacer = ' ';
const spaceStep = 4;
const offset = 2;

const getCurrentIndent = (depth) => replacer.repeat(depth * spaceStep - offset);
const getBracketIndent = (depth) => replacer.repeat(depth * spaceStep - spaceStep);

const formatStylish = (diff) => {
  function iter(data, depth) {
    // final dead end
    if (!_.isObject(data)) return String(data);

    if (isTrueObj(data)) {
      const lines = Object.entries(data).map(
        ([key, value]) => `${getCurrentIndent(depth)}  ${key}: ${iter(value, depth + 1)}`,
      );
      return ['{', ...lines.flat(), `${getBracketIndent(depth)}}`].join('\n');
    }

    const lines = data.map((el) => {
      const mapping = {
        nested: `${getCurrentIndent(depth)}  ${el.key}: ${iter(el.children, depth + 1)}`,
        changed: [
          `${getCurrentIndent(depth)}- ${el.key}: ${iter(el.value1, depth + 1)}`,
          `${getCurrentIndent(depth)}+ ${el.key}: ${iter(el.value2, depth + 1)}`,
        ],
        new: `${getCurrentIndent(depth)}+ ${el.key}: ${iter(el.value, depth + 1)}`,
        deleted: `${getCurrentIndent(depth)}- ${el.key}: ${iter(el.value, depth + 1)}`,
        not_changed: `${getCurrentIndent(depth)}  ${el.key}: ${iter(el.value, depth + 1)}`,
      };

      return mapping[el.type];
    });

    return ['{', ...lines.flat(), `${getBracketIndent(depth)}}`].join('\n');
  }
  return iter(diff, 1);
};

export default formatStylish;
