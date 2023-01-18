import _ from 'lodash';

export const formatPlain = (diff) => {
  const iter = (data) => {
    const result = data.map((el) => {
      if (el.status === 'changed' && el.nested) return iter(el.value);

      if (el.status === 'changed' && !el.nested) {
        return `Property '${el.key}' was updated. From '${el.file1}' to '${el.file2}'`;
      }

      if (el.status === 'changed type') {
        const originalValue = _.isObject(el.file1)
          ? '[complex value]'
          : `'${el.file1}'`;
        const newValue = _.isObject(el.file2)
          ? '[complex value]'
          : `'${el.file2}'`;
        return `Property '${el.key}' was updated. From ${originalValue} to ${newValue}`;
      }

      if (el.status === 'deleted') return `Property '${el.key}' was removed`;

      if (el.status === 'new') {
        const newValue = el.nested ? '[complex value]' : `'${el.file2}'`;
        return `Property '${el.key}' was added with value: ${newValue}`;
      }

      return null; // cases that are not needed to be in output
    });

    return result.filter((el) => el !== null).join('\n');
  };
  return iter(diff);
};

export const printPlain = (diff) => console.log(formatPlain(diff));
