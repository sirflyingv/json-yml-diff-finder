import _ from 'lodash';

const formatPlain = (diff) => {
  const iter = (data, path = '') => {
    const result = data.map((el) => {
      if (el.status === 'changed' && el.children) {
        const parentName = `${path}${el.key}.`;
        return iter(el.children, parentName);
      }

      const fullPath = path + el.key;

      const getPrintValue = (value) => {
        if (_.isObject(value)) return '[complex value]';
        if (_.isString(value)) return `'${value}'`;
        return value;
      };

      const originalValue = getPrintValue(el.value1);
      const updatedValue = getPrintValue(el.value2);
      const newValue = getPrintValue(el.children || el.value);

      if (el.status === 'changed') {
        return `Property '${fullPath}' was updated. From ${originalValue} to ${updatedValue}`;
      }

      if (el.status === 'changed type') {
        return `Property '${fullPath}' was updated. From ${originalValue} to ${updatedValue}`;
      }

      if (el.status === 'deleted') return `Property '${fullPath}' was removed`;

      if (el.status === 'new') {
        return `Property '${fullPath}' was added with value: ${newValue}`;
      }

      return null; // cases that are not needed to be in output
    });

    return result.filter((el) => el !== null).join('\n');
  };
  return iter(diff);
};

export default formatPlain;
