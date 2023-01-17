/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable function-paren-newline */
import _ from 'lodash';
import { parseEntries } from './src/parsers.js';

const addPropR = (obj, propName, propVal) => {
  if (obj.nested === true) {
    return {
      ...obj,
      [propName]: propVal,
      value: obj.value.map((el) => addPropR(el, propName, propVal))
    };
  }
  return {
    ...obj,
    [propName]: propVal
  };
};

export default (filepath1, filepath2) => {
  const entries1 = parseEntries(filepath1).map((entry) =>
    addPropR(entry, 'file', 1)
  );
  const entries2 = parseEntries(filepath2).map((entry) =>
    addPropR(entry, 'file', 2)
  );

  const iter = (data1, data2) => {
    const result = data1.map((entry) => {
      const indexOfSameEntry = _.findIndex(data2, (el) => el.key === entry.key);

      if (indexOfSameEntry === -1) {
        return {
          key: entry.key,
          file1: entry.value,
          file2: undefined,
          status: 'deleted', // should I mark it recursively?
          nested: entry.nested
        };
      }
      const comparedEntry = data2[indexOfSameEntry];

      if (_.isEqual(entry.value, comparedEntry.value)) {
        return {
          key: entry.key,
          file1: entry.value,
          file2: comparedEntry.value,
          status: 'not changed', // should I mark it recursively?
          nested: entry.nested
        };
      }

      if (
        !_.isEqual(entry.value, comparedEntry.value) &&
        !entry.nested &&
        !comparedEntry.nested
      ) {
        return {
          key: entry.key,
          file1: entry.value,
          file2: comparedEntry.value,
          status: 'changed',
          nested: entry.nested
        };
      }

      if (
        !_.isEqual(entry.value, comparedEntry.value) &&
        entry.nested === true &&
        comparedEntry.nested === true
      ) {
        return {
          key: entry.key,
          value: iter(entry.value, comparedEntry.value),
          status: 'changed',
          nested: entry.nested
        };
      }

      if (
        !_.isEqual(entry.value, comparedEntry.value) &&
        entry.nested !== comparedEntry.nested
      ) {
        return {
          key: entry.key,
          file1: entry.value,
          file2: comparedEntry.value,
          status: 'changed type',
          nested: entry.nested // IT'S ACTUALLY MORE COMPLICATED
        };
      }
    });

    //  find new entries here
    const newEntries = data2
      .filter(
        (entry) => _.findIndex(data1, (el) => el.key === entry.key) === -1
      )
      .map((entry) => ({
        key: entry.key,
        file1: undefined,
        file2: entry.value,
        status: 'new',
        nested: entry.nested
      }));

    const fullResult = _.orderBy([...result, ...newEntries], ['key']);

    return fullResult;
  };

  return iter(entries1, entries2);
};
