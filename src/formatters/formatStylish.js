import { isTrueObj } from '../helpers.js';

// config
const replacer = ' ';
const spaceStep = 4;
const offset = 2;

const getIndent = (depth) => replacer.repeat(depth * spaceStep - offset);
const getBracketIndent = (depth) => replacer.repeat(depth * spaceStep - spaceStep);

const stringifyData = (data, depth = 1) => {
  if (!isTrueObj(data)) return String(data);

  const lines = Object.entries(data).map(
    ([key, value]) => `${getIndent(depth)}  ${key}: ${stringifyData(value, depth + 1)}`,
  );
  return ['{', ...lines, `${getBracketIndent(depth)}}`].join('\n');
};

const mapping = {
  nested(node, depth, iter) {
    return `${getIndent(depth)}  ${node.key}: ${iter(node.children, depth + 1)}`;
  },
  changed(node, depth) {
    return [
      `${getIndent(depth)}- ${node.key}: ${stringifyData(node.value1, depth + 1)}`,
      `${getIndent(depth)}+ ${node.key}: ${stringifyData(node.value2, depth + 1)}`,
    ];
  },
  new(node, depth) {
    return `${getIndent(depth)}+ ${node.key}: ${stringifyData(node.value, depth + 1)}`;
  },
  deleted(node, depth) {
    return `${getIndent(depth)}- ${node.key}: ${stringifyData(node.value, depth + 1)}`;
  },
  not_changed(node, depth) {
    return `${getIndent(depth)}  ${node.key}: ${stringifyData(node.value, depth + 1)}`;
  },
};

const formatStylish = (diff, depth = 1) => {
  const lines = diff.map((node) => {
    const makeString = mapping[node.type];
    return makeString(node, depth, formatStylish);
  });

  return ['{', ...lines.flat(), `${getBracketIndent(depth)}}`].join('\n');
};

export default formatStylish;
