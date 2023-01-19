import _ from 'lodash';

const formatStylish = (diff) => {
  const iter = (data, depth) => {
    const indentSize = depth * 2;
    const currentIndent = ' '.repeat(indentSize);
    const bracketIndent = ' '.repeat(indentSize - 2);

    // final dead end
    if (!_.isObject(data)) {
      return `${data}`;
    }

    const result = data.map((el) => {
      const addDepth = el.nested ? 2 : 0;

      if (el.status === 'not changed' && !el.nested) {
        return `${currentIndent}  ${el.key}: ${el.file1}`;
      }

      if (el.status === 'changed' && el.nested) {
        return `${currentIndent}  ${el.key}: ${iter(el.value, depth + 2)}`;
      }

      if (el.status === 'changed' && !el.nested) {
        return `${currentIndent}- ${el.key}: ${el.file1}\n${currentIndent}+ ${el.key}: ${el.file2}`;
      }

      if (el.status === 'changed type') {
        return `${currentIndent}- ${el.key}: ${iter(
          el.file1,
          depth + 2,
        )}\n${currentIndent}+ ${el.key}: ${iter(el.file2, depth + 2)}`;
      }

      if (el.status === 'deleted') {
        return `${currentIndent}- ${el.key}: ${iter(el.file1, depth + addDepth)}`;
      }

      if (el.status === 'new') {
        return `${currentIndent}+ ${el.key}: ${iter(el.file2, depth + addDepth)}`;
      }

      // deep in deleted/new
      return `${currentIndent}  ${el.key}: ${iter(el.value, depth + addDepth)}`;
    });
    return ['{', ...result, `${bracketIndent}}`].join('\n');
  };
  return iter(diff, 1);
};

export default formatStylish;
