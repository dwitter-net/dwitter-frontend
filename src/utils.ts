export const getDweetLength = (code: string) =>
  [...code.replace(/\r\n/g, '\n')].length;

const getSurrogatePair = (firstCharCode: number, secondCharCode: number) => {
  return String.fromCharCode(
    0xd800 + firstCharCode,
    0xdc00 + (Number.isNaN(secondCharCode) ? 10 : secondCharCode)
  );
};

export const compressCode = (code: string) => {

  let compressedCode = '';
  for (let i = 0; i < code.length; i += 2) {
    let firstCharCode = code.charCodeAt(i);
    let secondCharCode = code.charCodeAt(i + 1);

    if (
      firstCharCode < 1024 &&
      (Number.isNaN(secondCharCode) || secondCharCode < 1024)
    ) {
      compressedCode += getSurrogatePair(firstCharCode, secondCharCode);
    } else {

      if (firstCharCode >= 1024) {
        compressedCode += code[i];
        if (!Number.isNaN(secondCharCode)) {
          if (secondCharCode >= 1024) {
            compressedCode += code[i + 1];
          } else {
            i--;
          }
        }
      } else {
        if (secondCharCode >= 1024) {
          compressedCode += code[i + 1];
        } else {
          i--;
        }
      }
    }
  }

  return 'eval(unescape(escape`' + compressedCode + "`.replace(/u../g,'')))";
}
