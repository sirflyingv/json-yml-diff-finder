import _ from 'lodash';

const formatPlain = (diff) => {
  const iter = (data, path = '') => {
    const result = data.map((el) => {
      if (el.type === 'nested') {
        const parentPath = `${path}${el.key}.`;
        return iter(el.children, parentPath);
      }

      const getPrintValue = (val) => {
        if (_.isObject(val)) return '[complex value]';
        if (_.isString(val)) return `'${val}'`;
        return val;
      };

      const fullPath = path + el.key;
      const originalValue = getPrintValue(el.value1);
      const updatedValue = getPrintValue(el.value2);
      const newValue = getPrintValue(el.value);

      const mapping = {
        changed: `Property '${fullPath}' was updated. From ${originalValue} to ${updatedValue}`,
        new: `Property '${fullPath}' was added with value: ${newValue}`,
        deleted: `Property '${fullPath}' was removed`,
        not_changed: null,
        nested: null,
      };

      return mapping[el.type];
    });

    return result.filter((el) => el !== null).join('\n');
  };
  return iter(diff);
};

export default formatPlain;
