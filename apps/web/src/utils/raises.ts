export const raises = (str: string): never => {
  throw new Error(str);
};
