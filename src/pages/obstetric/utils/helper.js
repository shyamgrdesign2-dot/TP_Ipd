export const isNumberCheck = (e) => {
  const { value } = e.target;
  const reg = /^[0-9]*$/;
  if (reg.test(value) || value === "") {
    return true;
  }
  return false;
};

export const isDecimalCheck = (e) => {
  const { value } = e.target;
  const reg = /^[0-9]*\.?[0-9]*$/;
  if (reg.test(value) || value === "") {
    return true;
  }
  return false;
};
