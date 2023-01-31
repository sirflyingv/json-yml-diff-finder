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
    if (!_.isObject(data)) {
      return String(data);
    }

    function makeLine(keyName, fieldName, prefix = ' ') {
      return `${getCurrentIndent(depth)}${prefix} ${keyName}: ${iter(
        fieldName,
        depth + 1,
      )}`;
    }
    if (isTrueObj(data)) {
      const lines = Object.entries(data).map(([key, value]) => makeLine(key, value));
      return ['{', ...lines, `${getBracketIndent(depth)}}`].join('\n');
    }

    const lines = data.map((el) => {
      const mapping = {
        nested: (lineFormatter) => lineFormatter(el.key, el.children),
        changed: (lineFormatter) => [
          lineFormatter(el.key, el.value1, '-'),
          lineFormatter(el.key, el.value2, '+'),
        ],
        new: (lineFormatter) => lineFormatter(el.key, el.value, '+'),
        deleted: (lineFormatter) => lineFormatter(el.key, el.value, '-'),
        not_changed: (lineFormatter) => lineFormatter(el.key, el.value),
      };

      return mapping[el.type](makeLine);
    });

    return ['{', ...lines.flat(), `${getBracketIndent(depth)}}`].join('\n');
  }
  return iter(diff, 1);
};

export default formatStylish;
