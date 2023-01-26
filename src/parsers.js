import yaml from 'js-yaml';

const mapping = {
  json: JSON.parse,
  yaml: yaml.load,
};

const parseFileData = (fileData, format) => {
  const parser = mapping[format];
  return parser(fileData);
};

export default parseFileData;
