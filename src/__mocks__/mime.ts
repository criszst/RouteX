module.exports = {
    getType: jest.fn((path) => {
      if (path.endsWith('.pdf')) return 'application/pdf';
      if (path.endsWith('.jpg')) return 'image/jpeg';
      return 'application/octet-stream';
    }),
  };