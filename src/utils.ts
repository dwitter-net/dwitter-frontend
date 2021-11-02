export const getDweetLength = (code: string) =>
  [...code.replace(/\r\n/g, '\n')].length;

// const getSurrogatePair = (firstCharCode: number, secondCharCode: number) => {
//   return String.fromCharCode(
//     0xd800 + firstCharCode,
//     0xdc00 + (Number.isNaN(secondCharCode) ? 10 : secondCharCode)
//   );
// };

export const compressCode = (code: string) => {
  if (code.length < 1) {
    return { compressedCode: code };
  }
  let compressedCode = '';
  let possibleDataLoss = false;
  for (let i = 0; i < code.length; i += 2) {
    let firstCharCode = code.charCodeAt(i);
    let secondCharCode = code.charCodeAt(i + 1);

    if (firstCharCode < 207 && !Number.isNaN(secondCharCode) && secondCharCode < 207) {
      compressedCode += String.fromCharCode(Number('0x' + firstCharCode.toString(16).padStart(2, '0') + secondCharCode.toString(16).padStart(2, '0')));
    } else {
      compressedCode += code[i];
      i--;
    }

    possibleDataLoss = possibleDataLoss || firstCharCode > 1023 || secondCharCode > 1023;
  }

  return {
    compressedCode: 'eval(unescape(escape`' + compressedCode + "`.replace(/u([^D].)/g,'$1%')))",
    possibleDataLoss
  };
}

const compressionIncipit = 'eval(unescape(escape';
const compressionTail = '.replace(/u';

export const isCodeCompressed = (code: string) =>
  code.lastIndexOf(compressionIncipit) !== -1 &&
  code.lastIndexOf(compressionTail) !== -1;

function getRegFromString(string: string) {
  var a = string.split("/");
  let modifiers = a.pop();
  a.shift();
  let pattern = a.join("/");
  return new RegExp(pattern, modifiers);
}

export const getUncompressedCode = (code: string) => {
  const escapedString = escape(
    code.slice(
      code.lastIndexOf(compressionIncipit) + 21,
      code.lastIndexOf(compressionTail) - 1
    )
  );
  const tail = code.slice(code.lastIndexOf(compressionTail), code.length).replace(/\s/g, '');
  const tailEnd = tail.indexOf("')") + 2;
  const regexpEnd = tail.indexOf(',');
  const regexString = tail.slice(9, regexpEnd);
  let replacement = tail.slice(regexpEnd + 1, tail.length).match(/'(.*?)'/);
  const unescapedString = unescape(
    escapedString.replace(
      getRegFromString(regexString),
      replacement ? replacement[1] : '')
  );
  return (
    code.slice(0, code.lastIndexOf(compressionIncipit)) +
    unescapedString +
    tail.slice(tailEnd + 2, tail.length)
  );
};
