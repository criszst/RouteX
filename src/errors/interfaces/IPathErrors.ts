interface IPathErrors {
  expected: string,
  received: string | object,
  file: string,
  line: number,
}

export default IPathErrors;