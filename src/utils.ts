export const getDweetLength = (code: string) =>
  [...code.replace(/\r\n/g, '\n')].length;
