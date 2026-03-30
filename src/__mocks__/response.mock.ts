import { expect, test, jest } from "bun:test";

export default function createMockResponse() {
  return {
    setHeader: jest.fn(),
    write: jest.fn(),
    end: jest.fn(),
    pipe: jest.fn(),
    send: jest.fn(),
    json: jest.fn(),
    download: jest.fn(),
    redirect: jest.fn(),
    sendFile: jest.fn(),
  } as any;
}
