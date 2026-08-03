export const colors = {
  blue: (text: string) => `\x1b[34m${text}\x1b[0m`,
  magenta: (text: string) => `\x1b[35m${text}\x1b[0m`,
  red: (text: string) => `\x1b[31m${text}\x1b[0m`,
  green: (text: string) => `\x1b[32m${text}\x1b[0m`,
  cyan: (text: string) => `\x1b[36m${text}\x1b[0m`,
  yellow: (text: string) => `\x1b[33m${text}\x1b[0m`,
  bright: (text: string) => `\x1b[1m${text}\x1b[0m`,
  dim: (text: string) => `\x1b[2m${text}\x1b[0m`,
};


export function log(tag: string, message: string, colorFn: (t: string) => string) {
  const rawTag = `[${tag.toUpperCase()}]`;

  const coloredTag = colorFn(rawTag);

  const paddingAmount = Math.max(1, 10 - rawTag.length);
  const spaces = " ".repeat(paddingAmount);

  console.log(`  ${coloredTag}${spaces}${message}`);
}