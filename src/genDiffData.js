import _ from 'lodash';
import { parseEntries } from './parsers.js';

const addPropR = (obj, propName, propVal) => {
  if (obj.nested === true) {
    return {
      ...obj,
      [propName]: propVal,
      value: obj.value.map((el) => addPropR(el, propName, propVal)),
    };
  }
  return {
    ...obj,
    [propName]: propVal,
  };
};

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

      if (_.isEqual(entry.value, newEntry.value)) {
        return {
          key: entry.key,
          file1: entry.value,
          file2: newEntry.value,
          status: 'not changed',
          nested: entry.nested,
        };
      }
      // prettier-ignore
      if (
        !_.isEqual(entry.value, newEntry.value)
        && !entry.nested
        && !newEntry.nested
      ) {
        return {
          key: entry.key,
          file1: entry.value,
          file2: newEntry.value,
          status: 'changed',
          nested: entry.nested,
        };
      }

      if (
        !_.isEqual(entry.value, newEntry.value) &&
        entry.nested &&
        newEntry.nested
      ) {
        return {
          key: entry.key,
          value: iter(entry.value, newEntry.value),
          status: 'changed',
          nested: entry.nested,
        };
      }
      // prettier-ignore
      if (
        !_.isEqual(entry.value, newEntry.value)
        && entry.nested !== newEntry.nested
      ) {
        return {
          key: entry.key,
          file1: entry.value,
          file2: newEntry.value,
          status: 'changed type',
          nested: entry.nested, // IT'S ACTUALLY MORE COMPLICATED
        };
      }
      return { status: 'wrong data' }; // crutch? to fix consictent return linting error
    });

    //  find new entries here
    const newEntries = data2
      .filter(
        (entry) => _.findIndex(data1, (el) => el.key === entry.key) === -1,
      )
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
