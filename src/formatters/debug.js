export default (diff) => JSON.stringify(diff, ' ', 2).replaceAll('"', '');
