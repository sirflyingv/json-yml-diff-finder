import _ from 'lodash';
import { isTrueObj } from './helpers.js';

const genDiffData = (data1, data2) => {
  const result = Object.keys({ ...data1, ...data2 }).map((key) => {
    const value1 = data1[key];
    const value2 = data2[key];

    const keyIsNew = !_.has(data1, key) && _.has(data2, key);
    if (keyIsNew) return { key, type: 'new', value: value2 };

    const keyIsDeleted = _.has(data1, key) && !_.has(data2, key);
    if (keyIsDeleted) return { key, type: 'deleted', value: value1 };

    const valuesAreEqual = _.isEqual(value1, value2);
    if (valuesAreEqual) return { key, type: 'not_changed', value: value1 };

    const bothValuesAreObjects = isTrueObj(value1) && isTrueObj(value2);
    if (bothValuesAreObjects) {
      return { key, type: 'nested', children: genDiffData(value1, value2) };
    }

    return {
      key,
      type: 'changed',
      value1,
      value2,
    };
  });
  return _.orderBy(result, ['key']);
};

export default genDiffData;
