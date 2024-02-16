export function useLocalStorage(key) {
  const getValue = () => localStorage.getItem(key) === null ? null : JSON.parse(localStorage.getItem(key));
  const setValue = (value) => localStorage.setItem(key, JSON.stringify(value));

  return [getValue, setValue];
}

export function clearLocalStorage() {
  localStorage.clear();
}
