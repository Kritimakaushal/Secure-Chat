const encrypt = (salt, text) => {
  const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);
  const textToChars = (text) => text.toString().split("").map((c) => c.charCodeAt(0));
  const byteHex = (n) => ("0" + Number(n).toString(16)).substr(-2);

  return text
    .split("")
    .map(textToChars)
    .map(applySaltToChar)
    .map(byteHex)
    .join("");
};

