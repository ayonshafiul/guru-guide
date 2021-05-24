import { useState, useEffect } from "react";

function getFromLocalStorage(key, initValue) {
  if (localStorage.getItem(key))
    return JSON.parse(localStorage.getItem(key))
  return initValue;
}

export default function useLocalStorage(key, initValue) {
  const [value, setValue] = useState(() => getFromLocalStorage(key, initValue));

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value]);

  return [value, setValue];
}
