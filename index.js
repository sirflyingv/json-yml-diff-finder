import _ from 'lodash';
import { parseEntries, getEntries } from './src/parsers.js';

export function genDiff(filepath1, filepath2) {
  const entries1 = parseEntries(filepath1);
  const entries2 = parseEntries(filepath2);

  const addMarkProp = (obj, mark) => ({ ...obj, mark });

  const differedEntries = _.differenceWith(entries1, entries2, _.isEqual).map(
    (entry) => addMarkProp(entry, '-')
  );
  const newEntries = _.differenceWith(entries2, entries1, _.isEqual).map(
    (entry) => addMarkProp(entry, '+')
  );
  const unchangedEntries = _.intersectionWith(
    entries1,
    entries2,
    _.isEqual
  ).map((entry) => addMarkProp(entry, ' '));

  const summary = [...differedEntries, ...newEntries, ...unchangedEntries];
  const summarySorted = _.orderBy(summary, ['key', 'mark'], ['asc', 'desc']);

  const makeDiffLine = (entry) => `${entry.mark} ${entry.key}: ${entry.value}`;

  const output = ['{', ...summarySorted.map(makeDiffLine), '}'].join('\n');

  return output;
}

// mark is not good for logical diff coz it's preparation for string output
// Let's make structure like {key: 'KEY', oldValue: {...}, newValue: {...}}

const isObject = (value) =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const getRecursiveEntries = (obj) => {
  const keyValuePairs = _.toPairs(obj);

  const entries = keyValuePairs.map((pair) => ({
    key: pair[0],
    value: isObject(pair[1]) ? getRecursiveEntries(pair[1]) : pair[1],
    nested: isObject(pair[1])
  }));
  return entries;
};

const addProp = (obj, propName, propVal) => ({ ...obj, [propName]: propVal });

export function genDiffTree(obj1, obj2) {
  const entries1 = getRecursiveEntries(obj1);
  const entries2 = getRecursiveEntries(obj2);

  // Something like this https://stackoverflow.com/questions/59735236/merging-two-objects-while-keeping-matching-keys

  // const markedEntries1 = entries1.map((entry) => isObject(entry)?
  //   addProp(entry, 'source', 'inFile1')
  // );
  // const markedEntries2 = entries2.map((entry) =>
  //   addProp(entry, 'source', 'inFile2')
  // );

  // return markedEntries1;
  return entries1;
}

const data1 = {
  hello: 'world',
  is: true,
  nested: { count: 5 },
  nested2: { count: { units: 'meters', n: 50 } },
  arr: ['peepo', 3, true]
};

const data2 = {
  hello: 'World!!!',
  is: true,
  nested: { count: 5, units: 'meters' },
  peepo: 'Happy',
  nested2: { count: 50 }
};

const plain1 = {
  string: 'value',
  boolean: true,
  number: 5,
  float: 1.5
};

const plain2 = {
  string: 'value',
  boolean: true,
  peepo: 'happy',
  float: 1.25
};

// console.log(genDiffTree(data1, data2));
console.log(genDiffTree(data1, data2));

// const isFlat = (obj) => {
//   const values = Object.values(obj);
//   return values.every(
//     (val) => typeof val !== 'object' || val === null || Array.isArray(val)
//   );
// };

// console.log(isFlat(plain1) && isFlat(plain2));
