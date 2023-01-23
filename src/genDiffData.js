import _ from 'lodash';
import { parseEntries } from './parsers.js';
import addPropR from './helpers.js';

export default (filepath1, filepath2) => {
  const entries1 = parseEntries(filepath1).map((el) => addPropR(el, 'file', 1));
  const entries2 = parseEntries(filepath2).map((el) => addPropR(el, 'file', 2));

  const iter = (data1, data2) => {
    const result = data1.map((entry) => {
      const indexOfSameEntry = _.findIndex(data2, (el) => el.key === entry.key);

      if (indexOfSameEntry === -1) {
        return {
          key: entry.key,
          file1: entry.value,
          file2: undefined,
          status: 'deleted',
          nested: entry.nested,
        };
      }

      const newEntry = data2[indexOfSameEntry];
      const valuesAreEqual = _.isEqual(entry.value, newEntry.value);

      if (valuesAreEqual) {
        return {
          key: entry.key,
          file1: entry.value,
          file2: newEntry.value,
          status: 'not changed',
          nested: entry.nested,
        };
      }

      if (!valuesAreEqual && !entry.nested && !newEntry.nested) {
        return {
          key: entry.key,
          file1: entry.value,
          file2: newEntry.value,
          status: 'changed',
          nested: entry.nested,
        };
      }

      if (!valuesAreEqual && entry.nested && newEntry.nested) {
        return {
          key: entry.key,
          value: iter(entry.value, newEntry.value),
          status: 'changed',
          nested: entry.nested,
        };
      }

      if (!valuesAreEqual && entry.nested !== newEntry.nested) {
        return {
          key: entry.key,
          file1: entry.value,
          file2: newEntry.value,
          status: 'changed type',
          nested: entry.nested, // IT'S ACTUALLY MORE COMPLICATED
        };
      }
      return { key: entry.key, status: 'invalid data' }; // crutch to fix consistent-return linting error
    });

    //  find new entries here
    const newEntries = data2
      .filter((entry) => _.findIndex(data1, (el) => el.key === entry.key) === -1)
      .map((entry) => ({
        key: entry.key,
        file1: undefined,
        file2: entry.value,
        status: 'new',
        nested: entry.nested,
      }));

    const fullResult = _.orderBy([...result, ...newEntries], ['key']);

    return fullResult;
  };

  return iter(entries1, entries2);
};
