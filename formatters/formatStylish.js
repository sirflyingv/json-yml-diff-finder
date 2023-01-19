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
    // dead ends
    if (!Array.isArray(data) && !data.status) {
      return `${currentIndent}  ${data.key}: ${data.value}`;
    }

    const result = data.map((el) => {
      // not changed not nested
      if (el.status === 'not changed' && !el.nested) {
        return `${currentIndent}  ${el.key}: ${el.file1}`;
      }

      // changed nested
      if (el.status === 'changed' && el.nested) {
        return `${currentIndent}  ${el.key}: ${iter(el.value, depth + 2)}`;
      }

      // changed !nested
      if (el.status === 'changed' && !el.nested) {
        return `${currentIndent}- ${el.key}: ${el.file1}\n${currentIndent}+ ${el.key}: ${el.file2}`;
      }

      // changed value and type
      if (el.status === 'changed type') {
        return `${currentIndent}- ${el.key}: ${iter(
          el.file1,
          depth + 2,
        )}\n${currentIndent}+ ${el.key}: ${iter(el.file2, depth + 2)}`;
      }

      //  deleted
      if (el.status === 'deleted') {
        const addDepth = el.nested ? 2 : 0;
        return `${currentIndent}- ${el.key}: ${iter(el.file1, depth + addDepth)}`;
      }

      // deep in deleted/new
      if (!el.status && el.nested) {
        return `${currentIndent}  ${el.key}: ${iter(el.value, depth + 2)}`;
      }

      // new
      if (el.status === 'new') {
        const addDepth = el.nested ? 2 : 0;
        return `${currentIndent}+ ${el.key}: ${iter(el.file2, depth + addDepth)}`;
      }

      // not changed not nested inside dead ends
      return `${currentIndent}  ${el.key}: ${el.value}`;
    });
    return ['{', ...result, `${bracketIndent}}`].join('\n');
  };
  return iter(diff, 1);
};

export default formatStylish;
