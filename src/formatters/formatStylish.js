import _ from 'lodash';

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

    const result = data.map((el) => {
      const addDepth = el.children ? depthCoeff : 0;

      if (el.status === 'not changed' && !el.children) {
        return `${currentIndent}  ${el.key}: ${el.value}`;
      }

      if (el.status === 'changed' && el.children) {
        return `${currentIndent}  ${el.key}: ${iter(el.children, depth + addDepth)}`;
      }

      if (el.status === 'changed' && !el.children) {
        return `${currentIndent}- ${el.key}: ${el.value1}\n${currentIndent}+ ${el.key}: ${el.value2}`;
      }

      if (el.status === 'changed type') {
        return `${currentIndent}- ${el.key}: ${iter(
          el.value1,
          depth + depthCoeff,
        )}\n${currentIndent}+ ${el.key}: ${iter(el.value2, depth + depthCoeff)}`;
      }

      if (el.status === 'deleted') {
        return `${currentIndent}- ${el.key}: ${iter(
          el.children || el.value,
          depth + addDepth,
        )}`;
      }

      if (el.status === 'new') {
        return `${currentIndent}+ ${el.key}: ${iter(
          el.children || el.value,
          depth + addDepth,
        )}`;
      }

      // deep in deleted/new
      return `${currentIndent}  ${el.key}: ${iter(
        el.children || el.value,
        depth + addDepth,
      )}`;
    });
    return ['{', ...result, `${bracketIndent}}`].join('\n');
  };
  return iter(diff, 1);
};

export default formatStylish;
