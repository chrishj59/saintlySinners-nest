const isIteratable = (obj: any) => {
  if (obj == null) {
    return false;
  }
  return typeof obj[Symbol.iterator] === 'function';
};

export { isIteratable };
