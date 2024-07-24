export const isNumberCheck = (e) => {
  const { value } = e.target;
  const reg = /^[0-9]*$/;
  if (reg.test(value) || value === "") {
    return true;
  }
  return false;
};
