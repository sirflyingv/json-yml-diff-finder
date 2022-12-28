import _ from 'lodash';
import { parseEntries } from './src/parsers.js';

function genDiff(filepath1, filepath2) {
  const entries1 = parseEntries(filepath1);
  const entries2 = parseEntries(filepath2);

  const addMarkProp = (obj, mark) => ({ ...obj, mark });

  const differedEntries = _.differenceWith(entries1, entries2, _.isEqual).map(
    (entry) => addMarkProp(entry, '-')
  );
  const newEntries = _.differenceWith(entries2, entries1, _.isEqual).map(
    (entry) => addMarkProp(entry, '+')
  );
  const unchangedEntries = _.intersectionWith(entries1, entries2, _.isEqual).map(
    (entry) => addMarkProp(entry, ' ')
  );

  const summary = [...differedEntries, ...newEntries, ...unchangedEntries];
  const summarySorted = _.orderBy(summary, ['key', 'mark'], ['asc', 'desc']);

  const makeDiffLine = (entry) => `${entry.mark} ${entry.key}: ${entry.value}`;

  const diffString = [
    '{',
    ...summarySorted.map((el) => makeDiffLine(el)),
    '}'
  ].join('\n');

  return diffString;
}
export default genDiff;
