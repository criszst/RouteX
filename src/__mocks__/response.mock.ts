export default function createMockResponse() {
  return {
    setHeader: jest.fn(),
    write: jest.fn(),
    end: jest.fn(),
    pipe: jest.fn(),
    send: undefined,
    json: undefined,
    download: undefined,
    redirect: undefined,
    sendFile: undefined,
  } as any;
}
