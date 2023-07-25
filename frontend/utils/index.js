export { default as gradientColors } from './gradientColors';

export function hexToRGB(hex) {
  var m = hex.match(/^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
  return {
    r: parseInt(m[1], 16),
    g: parseInt(m[2], 16),
    b: parseInt(m[3], 16),
  };
}

export function componentToHex(c) {
  const hex = Math.trunc(c).toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
}

export function rgbToHex({ r, g, b }) {
  const f = componentToHex;
  return `#${f(r)}${f(g)}${f(b)}`;
}
