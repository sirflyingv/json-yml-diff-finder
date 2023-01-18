import _ from 'lodash';

export const formatPlain = (diff) => {
  const iter = (data, path = '') => {
    const result = data.map((el) => {
      if (el.status === 'changed' && el.nested) {
        const parentName = `${path}${el.key}.`;
        return iter(el.value, parentName);
      }

      const fullPath = path + el.key;

      const preparePrintValue = (value) => {
        if (_.isObject(value)) return '[complex value]';
        if (_.isString(value)) return `'${value}'`;
        return value;
      };

      const originalValue = preparePrintValue(el.file1);
      const newValue = preparePrintValue(el.file2);

      if (el.status === 'changed' && !el.nested) {
        return `Property '${fullPath}' was updated. From ${originalValue} to ${newValue}`;
      }

      if (el.status === 'changed type') {
        return `Property '${fullPath}' was updated. From ${originalValue} to ${newValue}`;
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

export const printPlain = (diff) => console.log(formatPlain(diff));
