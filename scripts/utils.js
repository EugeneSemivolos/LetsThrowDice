export const sleep = (time) => new Promise((resolve) => {
  setTimeout(resolve, time);
});

export const map = (iterable, callback) => {
  const result = [];
  for (const item of iterable) {
    result.push(callback(item));
  }
  return result;
};

export const setAttribute = (iterable, key, value) => {
  for (const item of iterable) {
    item[key] = value;
  }
};

export const getDiceValueFromSrc = (src) => {
  const len = src.length;
  const posOfValueFromRight = 5;
  return parseInt(src[len - posOfValueFromRight]);
};

export const randNum = (max) => Math.floor(Math.random() * max);
