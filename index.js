import _ from 'lodash';
import { parseEntries } from './src/parsers.js';
import stringify from './src/stringify.js';

// export function genDiff(filepath1, filepath2) {
//   const entries1 = parseEntries(filepath1);
//   const entries2 = parseEntries(filepath2);

//   const addMarkProp = (obj, mark) => ({ ...obj, mark });

//   const differedEntries = _.differenceWith(entries1, entries2, _.isEqual).map(
//     (entry) => addMarkProp(entry, '-')
//   );
//   const newEntries = _.differenceWith(entries2, entries1, _.isEqual).map(
//     (entry) => addMarkProp(entry, '+')
//   );
//   const unchangedEntries = _.intersectionWith(
//     entries1,
//     entries2,
//     _.isEqual
//   ).map((entry) => addMarkProp(entry, ' '));

//   const summary = [...differedEntries, ...newEntries, ...unchangedEntries];
//   const summarySorted = _.orderBy(summary, ['key', 'mark'], ['asc', 'desc']);

//   const makeDiffLine = (entry) => `${entry.mark} ${entry.key}: ${entry.value}`;

//   const output = ['{', ...summarySorted.map(makeDiffLine), '}'].join('\n');

//   return output;
// }

// mark is not good for logical diff coz it's preparation for string output
// Let's make structure like {key: 'KEY', oldValue: {...}, newValue: {...}}

// const addProp = (obj, propName, propVal) => ({ ...obj, [propName]: propVal });

const addPropRecursive = (obj, propName, propVal) => {
  if (obj.nested === true) {
    return {
      ...obj,
      [propName]: propVal,
      value: obj.value.map((el) => addPropRecursive(el, propName, propVal))
    };
  }
  return {
    ...obj,
    [propName]: propVal
  };
};

export default function genDiffData(filepath1, filepath2) {
  const entries1 = parseEntries(filepath1).map((entry) =>
    addPropRecursive(entry, 'file', 1)
  );
  const entries2 = parseEntries(filepath2).map((entry) =>
    addPropRecursive(entry, 'file', 2)
  );

  // console.log(entries1[2]);

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

    return [...result, ...newEntries];
  };

  // const checkFlatEntry = (entry, data) => {
  //   const indexOfSameEntry = _.findIndex(data, (el) => el.key === entry.key);
  //   if (indexOfSameEntry === -1) {
  //     return {
  //       key: entry.key,
  //       file1: entry.value,
  //       file2: undefined,
  //       status: 'deleted'
  //     };
  //   }

  //   const comparedEntry = data[indexOfSameEntry];

  //   if (_.isEqual(entry.value, comparedEntry.value)) {
  //     return {
  //       key: entry.key,
  //       file1: entry.value,
  //       file2: comparedEntry.value,
  //       status: 'not changed'
  //     };
  //   }

  //   return {
  //     key: entry.key,
  //     file1: entry.value,
  //     file2: comparedEntry.value,
  //     status: 'changed'
  //   };
  // };

  // const iter = (tree1, tree2) => {
  //   const comparedFromTree1 = tree1.map((entry) => {
  //     if (!entry.nested) {
  //       const value = checkFlatEntry(entry, tree2);
  //       return { ...value, nested: entry.nested };
  //     }
  //     if (entry.nested) {
  //       const comparedEntryFromFile2 =
  //         tree2[_.findIndex(tree2, (el) => el.key === entry.key)];

  //       if (comparedEntryFromFile2) {
  //         const value = iter(entry.value, comparedEntryFromFile2.value);
  //         return {
  //           key: entry.key,
  //           value,
  //           status: 'changed',
  //           nested: true
  //         };
  //       }

  //       if (!comparedEntryFromFile2) {
  //         return {
  //           key: entry.key,
  //           file1: entry.value,
  //           file2: undefined,
  //           status: 'deleted',
  //           nested: entry.nested
  //         };
  //       }
  //     }
  //   });
  //   // console.log('TREE2', tree2); // IT DOESNT WORK IF PROP HAD NESTED VALUE AND BECAME FLAT
  //   const newFlatEntries = tree2
  //     .filter(
  //       (entry) => _.findIndex(tree1, (el) => el.key === entry.key) === -1
  //     )
  //     .map((entry) => ({
  //       key: entry.key,
  //       file1: undefined,
  //       file2: entry.value,
  //       status: 'new',
  //       nested: entry.nested
  //     }));

  //   // console.log('OK');

  //   return [...comparedFromTree1, ...newFlatEntries];
  // };

  return iter(entries1, entries2);
}

// const data1 = {
//   hello: 'world',
//   is: true,
//   nestedProp: { count: 5, units: 'm', verified: true },
//   nestedDeleted: { ppp: { lll: 'ddd' } }
// };

// const data2 = {
//   hello: 'World!!!',
//   is: true,
//   nestedProp: { count: 5, units: 'M (meters)' },
//   peepo: 'happy'
// };

// console.log(genDiffData(data1, data2).at(-2).file1[0]);

const formatStylish = (diff) => {
  const iter = (data) => {
    // dead ends
    if (typeof data === 'string') {
      return `${data}`;
    }
    // dead ends
    if (!Array.isArray(data) && !data.status) {
      return `  ${data.key}: ${data.value}`;
    }

    const result = data.map((el) => {
      // changed nested
      if (el.status === 'changed' && el.nested === true) {
        return `  ${el.key}: ${formatStylish(el.value)}`;
      }

      // not changed
      if (el.status === 'not changed' && el.nested === false) {
        return `  ${el.key}: ${el.file1}`;
      }

      // changed !nested
      if (el.status === 'changed' && el.nested === false) {
        return `- ${el.key}: ${el.file1} \n+ ${el.key}: ${el.file2}`;
      }
      // changed value and type
      if (el.status === 'changed type') {
        return `- ${el.key}: ${formatStylish(el.file1)} \n+ ${
          el.key
        }: ${formatStylish(el.file2)}`;
      }

      //  deleted !nested
      if (el.status === 'deleted' && el.nested === false) {
        return `- ${el.key}: ${el.file1}`;
      }

      //  deleted nested
      if (el.status === 'deleted' && el.nested === true) {
        return `- ${el.key}: \n ${formatStylish(el.file1)}`; // cringe
      }
      // deep in deleted/new
      if (!el.status && el.nested === true) {
        return `  ${el.key}: \n ${formatStylish(el.value)}`; // cringe
      }

      // new
      if (el.status === 'new' && el.nested === false) {
        return `+ ${el.key}: ${el.file2}`;
      }
      if (el.status === 'new' && el.nested === true) {
        return `+ ${el.key}: ${formatStylish(el.file2)}`;
      }

      // not changed inside nested
      if (el.status === undefined && el.nested === false) {
        return ` ${el.key}: ${el.value}`;
      }

      //   // for insisde nested unchanged flat stuff
      //   return ` ${el.key}: \n ${formatStylish(el.value)}`;
      return `${el.key}: ${el.value}`;
    });
    return ['{', ...result, '}'].join('\n');
  };
  return iter(diff);
};

// const tree1 = parseEntries('./__fixtures__/tree1.json');
// const tree2 = parseEntries('./__fixtures__/file2.json');

const test1 = genDiffData(
  './__fixtures__/tree1.yml',
  './__fixtures__/tree2.yml'
);

// const test1 = genDiffData(
//   './__fixtures__/file1.json',
//   './__fixtures__/file2.json'
// );

const outputStylish = formatStylish(test1);
console.log(outputStylish);
