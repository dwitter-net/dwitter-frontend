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
  let possibleDataLoss = false;
  for (let i = 0; i < code.length; i += 2) {
    let firstCharCode = code.charCodeAt(i);
    let secondCharCode = code.charCodeAt(i + 1);

    compressedCode += getSurrogatePair(firstCharCode, secondCharCode);
    possibleDataLoss = possibleDataLoss || firstCharCode > 1023 || secondCharCode > 1023;
  }

  return {
    compressedCode: 'eval(unescape(escape`' + compressedCode + "`.replace(/u../g,'')))",
    possibleDataLoss
  };
}
