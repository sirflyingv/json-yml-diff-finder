import _ from 'lodash';

const formatPlain = (diff) => {
  const iter = (data, path = '') => {
    const result = data.map((el) => {
      if (el.type === 'nested') {
        const parentName = `${path}${el.key}.`;
        return iter(el.children, parentName);
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

      if (el.type === 'changed') {
        return `Property '${fullPath}' was updated. From ${originalValue} to ${updatedValue}`;
      }

      if (el.type === 'deleted') return `Property '${fullPath}' was removed`;

      if (el.type === 'new') {
        return `Property '${fullPath}' was added with value: ${newValue}`;
      }
      return null; // cases that are not needed to be in output
    });

    return result.filter((el) => el !== null).join('\n');
  };
  return iter(diff);
};

export default formatPlain;
