import _ from 'lodash';
import { getRecursiveEntries } from './parsers.js';
import { isTrueObj } from './helpers.js';

const genDiffDataRe = (parsedData1, parsedData2) => {
  const result = Object.keys({ ...parsedData1, ...parsedData2 }).map((key) => {
    const oldValue = parsedData1[key];
    const newValue = parsedData2[key];

    const keyIsPersistent = _.has(parsedData1, key) && _.has(parsedData2, key);
    const keyIsDeleted = _.has(parsedData1, key) && !_.has(parsedData2, key);
    const keyIsNew = !_.has(parsedData1, key) && _.has(parsedData2, key);
    const valuesAreEqual = _.isEqual(oldValue, newValue);
    const bothValuesAreNested = isTrueObj(oldValue) && isTrueObj(newValue);
    const bothValuesAreFlat = !isTrueObj(oldValue) && !isTrueObj(newValue);
    const valueTypeChanged = isTrueObj(oldValue) !== isTrueObj(newValue);

    if (!valuesAreEqual && bothValuesAreNested) {
      return {
        key,
        status: 'changed',
        children: genDiffDataRe(oldValue, newValue),
      };
    }

    if (keyIsPersistent && !valuesAreEqual && bothValuesAreFlat) {
      return {
        key,
        status: 'changed',
        value1: oldValue,
        value2: newValue,
      };
    }

    if (valuesAreEqual && keyIsPersistent) {
      if (isTrueObj(oldValue)) {
        return {
          key,
          status: 'not changed',
          children: getRecursiveEntries(oldValue),
        };
      }
      return {
        key,
        status: 'not changed',
        value: oldValue,
      };
    }

    if (keyIsDeleted) {
      if (isTrueObj(oldValue)) {
        return {
          key,
          status: 'deleted',
          children: getRecursiveEntries(oldValue),
        };
      }
      return {
        key,
        status: 'deleted',
        value: oldValue,
      };
    }

    if (keyIsNew) {
      if (isTrueObj(newValue)) {
        return {
          key,
          status: 'new',
          children: getRecursiveEntries(newValue),
        };
      }
      return { key, status: 'new', value: newValue };
    }

    if (keyIsPersistent && valueTypeChanged) {
      return {
        key,
        status: 'changed type',
        value1: isTrueObj(oldValue) ? getRecursiveEntries(oldValue) : oldValue,
        value2: isTrueObj(newValue) ? getRecursiveEntries(newValue) : newValue,
      };
    }

    return { key, status: 'other' };
  });
  return _.orderBy(result, ['key']);

  /*
  const iter = (data1, data2) => {
    const result = data1.map((entry) => {
      const indexOfSameEntry = _.findIndex(data2, (el) => el.key === entry.key);

      if (indexOfSameEntry === -1) {
        return {
          type: 'deleted',
          key: entry.key,
          value1: entry.value,
          value2: undefined,
          status: 'deleted',
          nested: entry.nested,
        };
      }

      const newEntry = data2[indexOfSameEntry];
      const valuesAreEqual = _.isEqual(entry.value, newEntry.value);

      if (valuesAreEqual) {
        return {
          type: 'not changed',
          key: entry.key,
          value1: entry.value,
          value2: newEntry.value,
          status: 'not changed',
          nested: entry.nested,
        };
      }

      if (!valuesAreEqual && !entry.nested && !newEntry.nested) {
        return {
          type: 'changed',
          key: entry.key,
          value1: entry.value,
          value2: newEntry.value,
          status: 'changed',
          nested: entry.nested,
        };
      }

      if (!valuesAreEqual && entry.nested && newEntry.nested) {
        return {
          type: 'changed',
          key: entry.key,
          value: iter(entry.value, newEntry.value),
          status: 'changed',
          nested: entry.nested,
        };
      }

      if (!valuesAreEqual && entry.nested !== newEntry.nested) {
        return {
          key: entry.key,
          value1: entry.value,
          value2: newEntry.value,
          status: 'changed type',
          nested: entry.nested, // IT'S ACTUALLY MORE COMPLICATED
        }
      }
      return { key: entry.key, status: 'invalid data' }; // crutch to fix consistent-return
    });

    //  find new entries here
    const newEntries = data2
      .filter((entry) => _.findIndex(data1, (el) => el.key === entry.key) === -1)
      .map((entry) => ({
        key: entry.key,
        value1: undefined,
        value2: entry.value,
        status: 'new',
        nested: entry.nested,
      }));

    const fullResult = _.orderBy([...result, ...newEntries], ['key']);

    return fullResult;
  };

  return iter(entries1, entries2);
  */
};

export default genDiffDataRe;
