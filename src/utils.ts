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
    return code;
  }
  let compressedCode = '';
  for (let i = 0; i < code.length; i += 2) {
    let firstCharCode = code.charCodeAt(i);
    let secondCharCode = code.charCodeAt(i + 1);

    if (firstCharCode < 207 && !Number.isNaN(secondCharCode) && secondCharCode < 207) {
      compressedCode += String.fromCharCode(Number('0x' + firstCharCode.toString(16).padStart(2, '0') + secondCharCode.toString(16).padStart(2, '0')));
    } else if (firstCharCode < 207 && Number.isNaN(secondCharCode)) {
      compressedCode += String.fromCharCode(Number('0x' + firstCharCode.toString(16).padStart(2, '0') + '20'));
    } else {
      compressedCode += code[i];
      i--;
    }
  }

  return 'eval(unescape(escape`' + compressedCode + "`.replace(/u([^D].)/g,'$1%')))";
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

export const getUncompressedCode = (
  code: string,
  setError: React.Dispatch<React.SetStateAction<string>>,
) => {
  setError('');

  const escapedString = escape(
    code.slice(
      code.lastIndexOf(compressionIncipit) + 21,
      code.lastIndexOf(compressionTail) - 1
    )
  );

  const tail = code.slice(code.lastIndexOf(compressionTail), code.length).replace(/\s/g, '');

  var tailEnd = 2;
  if (tail.indexOf("')") !== -1) {
    tailEnd += tail.indexOf("')");
  } else if (tail.indexOf('")') !== -1) {
    tailEnd += tail.indexOf('")');
  } else if (tail.indexOf("`)") !== -1) {
    tailEnd += tail.indexOf("`)");
  }

  const regexpEnd = tail.indexOf(',');
  const regexString = tail.slice(9, regexpEnd);

  let replacement = tail.slice(regexpEnd + 1, tail.length).match(/('(.*?)'\)|"(.*?)"\)|`(.*?)`\))/);

  const unescapedString = unescape(
    escapedString.replace(
      getRegFromString(regexString),
      replacement ? replacement[2] ?? replacement[3] ?? replacement[4] ?? '' : '')
  );

  return (
    code.slice(0, code.lastIndexOf(compressionIncipit)) + // code before the "eval"
    unescapedString + // uncompressed code
    tail.slice(tailEnd + 2, tail.length) // code after the compressed section
  ).trim();
};
