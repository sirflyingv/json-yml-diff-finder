const formatStylish = (diff) => {
  const iter = (data, depth) => {
    const indentSize = depth * 2;
    const currentIndent = ' '.repeat(indentSize);
    const bracketIndent = ' '.repeat(indentSize - 2);

    // dead ends
    if (typeof data === 'string') {
      return `${data}`;
    }
    // dead ends
    if (!Array.isArray(data) && !data.status) {
      return `${currentIndent}  ${data.key}: ${data.value}`;
    }

    const result = data.map((el) => {
      // changed nested
      if (el.status === 'changed' && el.nested === true) {
        return `${currentIndent}  ${el.key}: ${iter(el.value, depth + 2)}`;
      }

      // not changed not nested
      if (el.status === 'not changed' && el.nested === false) {
        return `${currentIndent}  ${el.key}: ${el.file1}`;
      }

      // changed !nested
      if (el.status === 'changed' && el.nested === false) {
        return `${currentIndent}- ${el.key}: ${el.file1}\n${currentIndent}+ ${el.key}: ${el.file2}`;
      }
      // changed value and type
      if (el.status === 'changed type') {
        return `${currentIndent}- ${el.key}: ${iter(
          el.file1,
          depth + 2
        )}\n${currentIndent}+ ${el.key}: ${iter(el.file2, depth + 2)}`;
      }

      //  deleted !nested
      if (el.status === 'deleted' && el.nested === false) {
        return `${currentIndent}- ${el.key}: ${el.file1}`;
      }

      //  deleted nested
      if (el.status === 'deleted' && el.nested === true) {
        return `${currentIndent}- ${el.key}: ${iter(el.file1, depth + 2)}`;
      }
      // deep in deleted/new
      if (!el.status && el.nested === true) {
        return `${currentIndent}  ${el.key}: ${iter(el.value, depth + 2)}`;
      }

      // new
      if (el.status === 'new' && el.nested === false) {
        return `${currentIndent}+ ${el.key}: ${el.file2}`;
      }
      if (el.status === 'new' && el.nested === true) {
        return `${currentIndent}+ ${el.key}: ${iter(el.file2, depth + 2)}`;
      }

      // not changed inside nested
      if (el.status === undefined && el.nested === false) {
        return `${currentIndent}  ${el.key}: ${el.value}`;
      }

      //   // for insisde nested unchanged flat stuff
      //   return ` ${el.key}: \n ${formatStylish(el.value)}`;
      return `${currentIndent}  ${el.key}: ${el.value}`;
    });
    return ['{', ...result, `${bracketIndent}}`].join('\n');
  };
  return iter(diff, 1);
};

export default formatStylish;
