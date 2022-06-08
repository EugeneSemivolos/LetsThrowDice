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
