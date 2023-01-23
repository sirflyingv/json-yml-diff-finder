export const addPropR = (obj, propName, propVal) => {
  if (obj.nested === true) {
    const value = obj.value.map((el) => addPropR(el, propName, propVal));
    return { ...obj, [propName]: propVal, value };
  }
  return { ...obj, [propName]: propVal };
};

export function isTrueObj(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
