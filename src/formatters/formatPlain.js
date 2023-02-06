import _ from 'lodash';

const getPrintValue = (val) => {
  if (_.isObject(val)) return '[complex value]';
  if (_.isString(val)) return `'${val}'`;
  return val;
};

const getValue1 = (node) => getPrintValue(node.value1);
const getValue2 = (node) => getPrintValue(node.value2);
const getValue = (node) => getPrintValue(node.value);
const getPath = (node, path) => `${path || ''}${node.key}`;

const mapping = {
  changed(node, path) {
    return `Property '${getPath(node, path)}' was updated. From ${getValue1(node)} to ${getValue2(
      node,
    )}`;
  },
  new: (node, path) => `Property '${getPath(node, path)}' was added with value: ${getValue(node)}`,
  deleted: (node, path) => `Property '${getPath(node, path)}' was removed`,
  not_changed: () => null,
  nested: (node, path, iter) => iter(node.children || [], `${path || ''}${node.key}.`),
};

const formatPlain = (diff, path = '') => {
  const result = diff
    .map((node) => {
      const fn = mapping[node.type];
      return fn(node, path, formatPlain);
    })
    .filter((el) => el !== null)
    .join('\n');

  return result;
};

export default formatPlain;
