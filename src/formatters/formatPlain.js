import _ from 'lodash';

const getPrintValue = (val) => {
  if (_.isObject(val)) return '[complex value]';
  if (_.isString(val)) return `'${val}'`;
  return val;
};

const mapping = {
  root(node, path, iter) {
    const lines = node.children.map((child) => {
      const makeString = mapping[child.type];
      return makeString(child, path, iter);
    });
    return lines.flat().join('\n');
  },
  changed(node, path) {
    return `Property '${path}${node.key}' was updated. From ${getPrintValue(
      node.value1,
    )} to ${getPrintValue(node.value2)}`;
  },
  new(node, path) {
    return `Property '${path}${node.key}' was added with value: ${getPrintValue(node.value)}`;
  },
  deleted: (node, path) => `Property '${path}${node.key}' was removed`,
  unchanged: () => [],
  nested: (node, path, iter) => iter(node.children, `${path}${node.key}.`),
};

const formatPlain = (node, path = '') => {
  const makeString = mapping[node.type];
  return makeString(node, path, formatPlain);
};

export default formatPlain;
