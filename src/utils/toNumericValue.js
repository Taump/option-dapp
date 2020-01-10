const toNumericValue = value => {
  const t = /^-{0,1}\d+$/.test(value);
  if (t && value <= Number.MAX_SAFE_INTEGER) {
    return value;
  } else {
    return `'${value}'`;
  }
};

export default toNumericValue;
